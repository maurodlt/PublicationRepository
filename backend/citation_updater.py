from typing import Any, Dict, List, Optional, Tuple

from pyalex import Works, config
from sqlalchemy.orm import Session

from sql_alchemy import Publication

config.max_retries = 3
config.retry_backoff_factor = 0.1
config.retry_http_codes = [429, 500, 503]


def _extract_publication_date(work: Dict[str, Any]) -> str:
    if not isinstance(work, dict):
        return ""
    date_value = work.get("publication_date")
    if date_value:
        return str(date_value)
    year_value = work.get("publication_year")
    if year_value is not None:
        return str(year_value)
    return ""


def _select_most_recent_work(works: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if not works:
        return None
    best = works[0]
    best_date = _extract_publication_date(best)
    for work in works[1:]:
        current_date = _extract_publication_date(work)
        if current_date and current_date > best_date:
            best = work
            best_date = current_date
    return best


def _get_citation_count_from_work(work: Dict[str, Any]) -> Optional[int]:
    if not isinstance(work, dict):
        return None
    citation_count = work.get("cited_by_count")
    if citation_count is None:
        citation_count = work.get("biblio", {}).get("cited_by_count") if isinstance(work.get("biblio"), dict) else None
    if citation_count is None and isinstance(work.get("counts"), dict):
        citation_count = work["counts"].get("citation_count")
    if citation_count is None:
        return None
    try:
        return int(citation_count)
    except (TypeError, ValueError):
        return None


def _search_publication_citations(title: str) -> Tuple[Optional[int], Optional[str]]:
    if not title or not title.strip():
        return None, "publication title is empty"

    exact_title = f'"{title.strip()}"'
    works = Works().search_filter(title=exact_title).get()
    if not works:
        return None, "no match found"

    best_match = _select_most_recent_work(works)
    if best_match is None:
        return None, "no valid work found"

    citations = _get_citation_count_from_work(best_match)
    if citations is None:
        return None, "citation count not available"

    return citations, None


def update_publication_citations(database: Session, email: str | None = None) -> Dict[str, Any]:

    if email:
        config.email = email

    publications = database.query(Publication).all()
    updated_items: List[Dict[str, Any]] = []
    errors: List[Dict[str, Any]] = []

    for publication in publications:
        title = getattr(publication, "title", None)
        if not title:
            errors.append({
                "publication_id": getattr(publication, "id", None),
                "title": title,
                "error": "missing title",
            })
            continue

        try:
            citations, error = _search_publication_citations(title)
            if error is not None:
                errors.append({
                    "publication_id": publication.id,
                    "title": title,
                    "error": error,
                })
                continue

            publication.citations = citations
            updated_items.append({
                "publication_id": publication.id,
                "title": title,
                "citations": citations,
            })
        except Exception as exc:
            errors.append({
                "publication_id": publication.id,
                "title": title,
                "error": str(exc),
            })

    database.commit()
    return {
        "updated_count": len(updated_items),
        "updated": updated_items,
        "errors": errors,
    }
