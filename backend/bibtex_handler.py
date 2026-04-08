import re
import html
import logging
from sqlalchemy.orm import Session
from sql_alchemy import Author, Institution, Publication, Journal, Book, Proceedings, Conference, Thesis, Others, publication_institution, author_publication, author_institution

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def normalize_bibtex_value(raw_value: str) -> str:
    """Strip BibTeX formatting characters from field values."""
    if raw_value is None:
        return ""
    value = raw_value.strip().strip('{}').strip('"').strip()
    return value


def get_field_value(fields: dict, field_name: str, default: str = "N/A") -> str:
    """Get a field value with a default placeholder if missing or empty."""
    value = normalize_bibtex_value(fields.get(field_name, ""))
    return value if value else default


def split_authors(raw_authors: str) -> list[str]:
    """Split author string by 'and' separator."""
    if not raw_authors:
        return []
    parts = [part.strip() for part in re.split(r'\s+and\s+', raw_authors, flags=re.IGNORECASE) if part.strip()]
    return parts


def parse_bibtex_entries(raw_text: str) -> list[dict]:
    """Parse BibTeX file content and extract entries with fields."""
    entries = []
    # Find all @type{...} entries
    entry_pattern = r'@(\w+)\s*\{\s*([^,\}]+)\s*,'
    
    for match in re.finditer(entry_pattern, raw_text, re.IGNORECASE):
        entry_type = match.group(1).lower()
        citation_key = match.group(2).strip()
        
        # Find the content between braces
        start_pos = match.start()
        brace_start = raw_text.find('{', start_pos)
        if brace_start == -1:
            continue
            
        # Count braces to find the matching closing brace
        brace_count = 0
        end_pos = brace_start
        for i, c in enumerate(raw_text[brace_start:]):
            if c == '{':
                brace_count += 1
            elif c == '}':
                brace_count -= 1
                if brace_count == 0:
                    end_pos = brace_start + i
                    break
        
        if end_pos == brace_start:
            continue
        
        # Extract content between braces (excluding the braces themselves)
        content = raw_text[brace_start + 1:end_pos].strip()
        
        # Parse fields by looking for field=value patterns
        fields = {}
        # Split by comma but be careful about nested braces
        field_assignments = []
        current_field_text = []
        brace_depth = 0
        
        for char in content:
            if char == '{':
                brace_depth += 1
                current_field_text.append(char)
            elif char == '}':
                brace_depth -= 1
                current_field_text.append(char)
            elif char == ',' and brace_depth == 0:
                field_assignments.append(''.join(current_field_text).strip())
                current_field_text = []
            else:
                current_field_text.append(char)
        
        # Don't forget the last field
        if current_field_text:
            field_assignments.append(''.join(current_field_text).strip())
        
        # Now parse each field assignment
        for field_text in field_assignments:
            if '=' not in field_text:
                continue
            
            field_name, field_value = field_text.split('=', 1)
            field_name = field_name.strip().lower()
            field_value = field_value.strip()
            
            # Remove outer braces or quotes if present
            if (field_value.startswith('{') and field_value.endswith('}')):
                field_value = field_value[1:-1]
            elif (field_value.startswith('"') and field_value.endswith('"')):
                field_value = field_value[1:-1]
            
            field_value = field_value.strip()
            
            if field_name and field_value:
                fields[field_name] = field_value
        
        if fields:  # Only add entries that have fields
            entries.append({
                'entry_type': entry_type,
                'citation_key': citation_key,
                'fields': fields,
            })
            logger.info(f"Parsed entry: {entry_type}({citation_key}) with fields: {list(fields.keys())}")
    
    logger.info(f"Parser found {len(entries)} entries in BibTeX file")
    return entries


def normalize_person_name(raw_name: str) -> tuple[str, str]:
    """Parse author name into first and last name components."""
    name = normalize_bibtex_value(raw_name)
    name = html.unescape(name)
    name = re.sub(r'<[^>]+>', '', name)
    name = re.sub(r'\s+', ' ', name).strip().strip('{}"')

    if not name:
        return '', ''

    if ',' in name:
        parts = [part.strip() for part in name.split(',', 1)]
        last_name = parts[0]
        first_name = parts[1] if len(parts) > 1 else ''
    else:
        parts = name.split()
        if len(parts) > 1:
            last_name = parts[-1]
            first_name = ' '.join(parts[:-1])
        else:
            last_name = name
            first_name = ''
    return first_name, last_name


def find_or_create_author(raw_name: str, database: Session) -> int:
    """Find existing author or create new one by name."""
    first_name, last_name = normalize_person_name(raw_name)
    author = database.query(Author).filter(Author.name == first_name, Author.last_name == last_name).first()
    if author:
        return author.id
    db_author = Author(name=first_name, last_name=last_name)
    database.add(db_author)
    database.commit()
    database.refresh(db_author)
    return db_author.id


def find_or_create_institution(raw_name: str, database: Session) -> int:
    """Find existing institution or create new one by name."""
    name = normalize_bibtex_value(raw_name) or "Unknown"
    institution = database.query(Institution).filter(Institution.name == name).first()
    if institution:
        return institution.id
    db_institution = Institution(name=name, country="", city="")
    database.add(db_institution)
    database.commit()
    database.refresh(db_institution)
    return db_institution.id


def ensure_unknown_institution(database: Session) -> tuple[int, bool]:
    """Ensure an Institution named 'Unknown' exists and return (id, created_now)."""
    institution = database.query(Institution).filter(Institution.name == "Unknown").first()
    if institution:
        return institution.id, False
    db_institution = Institution(name="Unknown", country="", city="")
    database.add(db_institution)
    database.commit()
    database.refresh(db_institution)
    return db_institution.id, True


def ensure_author_institution_link(author_id: int, institution_id: int, database: Session) -> None:
    """Ensure the author_institution relationship exists."""
    existing = database.query(author_institution).filter(
        (author_institution.c.author == author_id)
        & (author_institution.c.institution == institution_id)
    ).first()
    if existing:
        return
    database.execute(author_institution.insert().values(author=author_id, institution=institution_id))
    database.commit()


def create_publication_from_entry(entry: dict, author_ids: list[int], institution_id: int, database: Session) -> int:
    """Create a publication record from a parsed BibTeX entry."""
    fields = entry['fields']
    year_str = fields.get('year', '0').strip()
    try:
        year = int(re.sub(r'\D', '', year_str)) if year_str else 0
    except ValueError:
        year = 0
    title = get_field_value(fields, 'title', 'Untitled')
    entry_type = entry['entry_type']
    
    logger.info(f"Creating publication: type={entry_type}, title={title}, year={year}")
    
    if entry_type in ('article', 'journal'):
        db_obj = Journal(
            title=title,
            year=year,
            pages=get_field_value(fields, 'pages'),
            journal=get_field_value(fields, 'journal'),
            note=get_field_value(fields, 'note'),
            number=get_field_value(fields, 'number'),
            volume=get_field_value(fields, 'volume'),
            month=get_field_value(fields, 'month'),
        )
    elif entry_type == 'book':
        db_obj = Book(
            title=title,
            year=year,
            address=get_field_value(fields, 'address'),
            publisher=get_field_value(fields, 'publisher'),
        )
    elif entry_type == 'proceedings':
        db_obj = Proceedings(
            title=title,
            year=year,
            address=get_field_value(fields, 'address'),
            editor=get_field_value(fields, 'editor'),
            month=get_field_value(fields, 'month'),
            volume=get_field_value(fields, 'volume'),
            organization=get_field_value(fields, 'organization'),
            number=get_field_value(fields, 'number'),
            publisher=get_field_value(fields, 'publisher'),
            series=get_field_value(fields, 'series'),
            pages=get_field_value(fields, 'pages'),
            booktitle=get_field_value(fields, 'booktitle'),
        )
    elif entry_type in ('inproceedings', 'conference'):
        db_obj = Conference(
            title=title,
            year=year,
            publisher=get_field_value(fields, 'publisher'),
            series=get_field_value(fields, 'series'),
            note=get_field_value(fields, 'note'),
            pages=get_field_value(fields, 'pages'),
            address=get_field_value(fields, 'address'),
            editor=get_field_value(fields, 'editor'),
            month=get_field_value(fields, 'month'),
            organization=get_field_value(fields, 'organization'),
            booktitle=get_field_value(fields, 'booktitle'),
            number=get_field_value(fields, 'number'),
        )
    elif entry_type in ('phdthesis', 'mastersthesis', 'thesis'):
        db_obj = Thesis(
            title=title,
            year=year,
            month=get_field_value(fields, 'month'),
            address=get_field_value(fields, 'address'),
            type=get_field_value(fields, 'type'),
            note=get_field_value(fields, 'note'),
        )
    else:
        db_obj = Others(
            title=title,
            year=year,
            peer_reviewed=normalize_bibtex_value(fields.get('peer_reviewed', 'false')).lower() in ('true', '1', 'yes'),
            link=get_field_value(fields, 'url', ''),
            server=get_field_value(fields, 'publisher', ''),
        )
    
    database.add(db_obj)
    database.flush()  # Flush to get the ID without fully committing
    database.refresh(db_obj)
    logger.info(f"Created {entry_type} publication with ID {db_obj.id}")
    
    if institution_id is not None:
        logger.info(f"Adding institution {institution_id} to publication {db_obj.id}")
        database.execute(publication_institution.insert().values(publication=db_obj.id, institution_1=institution_id))
    
    for author_id in author_ids:
        logger.info(f"Adding author {author_id} to publication {db_obj.id}")
        database.execute(author_publication.insert().values(publication_1=db_obj.id, author_1=author_id))
    
    database.commit()
    database.refresh(db_obj)
    logger.info(f"Successfully saved publication {db_obj.id} with {len(author_ids)} authors and institution {institution_id}")
    return db_obj.id


async def process_bibtex_import(raw_text: str, database: Session) -> dict:
    """Main entry point for BibTeX import processing."""
    entries = parse_bibtex_entries(raw_text)
    logger.info(f"Parsed {len(entries)} BibTeX entries")
    
    created = {
        'authors': 0,
        'institutions': 0,
        'publications': 0,
        'journals': 0,
        'books': 0,
        'proceedings': 0,
        'conferences': 0,
        'theses': 0,
        'others': 0,
    }

    unknown_institution_id, unknown_created = ensure_unknown_institution(database)
    if unknown_created:
        created['institutions'] += 1

    for idx, entry in enumerate(entries):
        logger.info(f"Processing entry {idx + 1}: {entry.get('entry_type')} - {entry.get('citation_key')}")
        
        # Check if publication with same title already exists
        title = get_field_value(entry['fields'], 'title', 'Untitled')
        existing_publication = database.query(Publication).filter(Publication.title == title).first()
        if existing_publication:
            logger.info(f"Publication with title '{title}' already exists (ID {existing_publication.id}). Skipping duplicate.")
            continue
        
        # BibTeX entries do not reliably contain institutions. Use 'Unknown' as fallback.
        institution_id = unknown_institution_id
        if 'institution' in entry['fields']:
            raw_institution_name = normalize_bibtex_value(entry['fields'].get('institution', ''))
            if raw_institution_name:
                existing_institution = database.query(Institution).filter(Institution.name == raw_institution_name).first()
                if existing_institution:
                    institution_id = existing_institution.id
                else:
                    institution_id = find_or_create_institution(raw_institution_name, database)
                    created['institutions'] += 1

        raw_authors = entry['fields'].get('author', '')
        author_names = split_authors(raw_authors)
        author_ids = []
        for author_name in author_names:
            first_name, last_name = normalize_person_name(author_name)
            existing_author = database.query(Author).filter(Author.name == first_name, Author.last_name == last_name).first()
            if existing_author:
                author_ids.append(existing_author.id)
            else:
                new_author_id = find_or_create_author(author_name, database)
                author_ids.append(new_author_id)
                ensure_author_institution_link(new_author_id, institution_id, database)
                created['authors'] += 1

        if not author_ids:
            first_name, last_name = normalize_person_name('Unknown Unknown')
            existing_author = database.query(Author).filter(Author.name == first_name, Author.last_name == last_name).first()
            if existing_author:
                unknown_author_id = existing_author.id
            else:
                unknown_author_id = find_or_create_author('Unknown Unknown', database)
                ensure_author_institution_link(unknown_author_id, institution_id, database)
                created['authors'] += 1
            author_ids.append(unknown_author_id)

        pub_id = create_publication_from_entry(entry, author_ids, institution_id, database)
        logger.info(f"Created publication with ID {pub_id}")
        created['publications'] += 1
        entry_type = entry['entry_type']
        if entry_type in ('article', 'journal'):
            created['journals'] += 1
        elif entry_type == 'book':
            created['books'] += 1
        elif entry_type == 'proceedings':
            created['proceedings'] += 1
        elif entry_type in ('inproceedings', 'conference'):
            created['conferences'] += 1
        elif entry_type in ('phdthesis', 'mastersthesis', 'thesis'):
            created['theses'] += 1
        else:
            created['others'] += 1

    return {
        'message': 'BibTeX import completed',
        'created': created,
        'entries_processed': len(entries),
    }
