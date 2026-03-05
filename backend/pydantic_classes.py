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
    city: str
    name: str
    country: str
    publication: List[int]  # N:M Relationship
    author: List[int]  # N:M Relationship


class AuthorCreate(BaseModel):
    name: str
    last_name: str
    institution: List[int]  # N:M Relationship
    publication_1: List[int]  # N:M Relationship


class PublicationCreate(BaseModel):
    title: str
    year: int
    institution_1: List[int]  # N:M Relationship
    author_1: List[int]  # N:M Relationship


class ConferenceCreate(PublicationCreate):
    note: str
    booktitle: str
    address: str
    series: str
    month: str
    pages: str
    publisher: str
    organization: str
    editor: str
    number: str


class ProceedingsCreate(PublicationCreate):
    number: str
    editor: str
    address: str
    month: str
    pages: str
    series: str
    organization: str
    publisher: str
    volume: str
    booktitle: str


class BookCreate(PublicationCreate):
    address: str
    publisher: str


class ThesisCreate(PublicationCreate):
    type: str
    address: str
    month: str
    note: str


class OthersCreate(PublicationCreate):
    peer_reviewed: bool
    link: str
    server: str


class JournalCreate(PublicationCreate):
    month: str
    journal: str
    volume: str
    note: str
    pages: str
    number: str


