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
    name: str
    city: str
    author: List[int]  # N:M Relationship
    publication: List[int]  # N:M Relationship


class AuthorCreate(BaseModel):
    name: str
    last_name: str
    publication_1: List[int]  # N:M Relationship
    institution: List[int]  # N:M Relationship


class PublicationCreate(BaseModel):
    year: int
    title: str
    author_1: List[int]  # N:M Relationship
    institution_1: List[int]  # N:M Relationship


class ConferenceCreate(PublicationCreate):
    booktitle: str
    number: str
    publisher: str
    address: str
    note: str
    organization: str
    series: str
    editor: str
    pages: str
    month: str


class ProceedingsCreate(PublicationCreate):
    publisher: str
    series: str
    number: str
    organization: str
    month: str
    editor: str
    booktitle: str
    address: str
    pages: str
    volume: str


class BookCreate(PublicationCreate):
    address: str
    publisher: str


class ThesisCreate(PublicationCreate):
    note: str
    address: str
    type: str
    month: str


class OthersCreate(PublicationCreate):
    peer_reviewed: bool
    server: str
    link: str


class JournalCreate(PublicationCreate):
    volume: str
    number: str
    journal: str
    month: str
    pages: str
    note: str


