from datetime import datetime, date, time
from typing import Any, List, Optional, Union, Set
from enum import Enum
from pydantic import BaseModel, field_validator


############################################
# Enumerations are defined here
############################################

############################################
# Classes are defined here
############################################
class InstitutionCreate(BaseModel):
    country: str
    city: str
    name: str
    author: List[int]  # N:M Relationship
    publication: List[int]  # N:M Relationship


class AuthorCreate(BaseModel):
    name: str
    last_name: str
    institution: List[int]  # N:M Relationship
    publication_1: List[int]  # N:M Relationship


class PublicationCreate(BaseModel):
    title: str
    year: int
    citations: Optional[int] = None
    institution_1: List[int]  # N:M Relationship
    author_1: List[int]  # N:M Relationship


class ConferenceCreate(PublicationCreate):
    organization: str
    publisher: str
    pages: str
    booktitle: str
    series: str
    editor: str
    month: str
    address: str
    note: str
    number: str


class JournalCreate(PublicationCreate):
    pages: str
    journal: str
    note: str
    number: str
    volume: str
    month: str


class ProceedingsCreate(PublicationCreate):
    booktitle: str
    editor: str
    address: str
    organization: str
    number: str
    volume: str
    pages: str
    series: str
    publisher: str
    month: str


class BookCreate(PublicationCreate):
    address: str
    publisher: str


class ThesisCreate(PublicationCreate):
    address: str
    month: str
    note: str
    type: str


class OthersCreate(PublicationCreate):
    peer_reviewed: bool
    link: str
    server: str


