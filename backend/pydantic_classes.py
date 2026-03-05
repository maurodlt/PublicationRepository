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
    publication: List[int]  # N:M Relationship
    author: List[int]  # N:M Relationship


class AuthorCreate(BaseModel):
    name: str
    last_name: str
    publication_1: List[int]  # N:M Relationship
    institution: List[int]  # N:M Relationship


class PublicationCreate(BaseModel):
    title: str
    year: int
    author_1: List[int]  # N:M Relationship
    institution_1: List[int]  # N:M Relationship


class ConferenceCreate(PublicationCreate):
    address: str
    note: str
    organization: str
    editor: str
    booktitle: str
    pages: str
    month: str
    number: str
    publisher: str
    series: str


class ProceedingsCreate(PublicationCreate):
    editor: str
    number: str
    pages: str
    volume: str
    month: str
    series: str
    publisher: str
    organization: str
    booktitle: str
    address: str


class BookCreate(PublicationCreate):
    publisher: str
    address: str


class ThesisCreate(PublicationCreate):
    address: str
    type: str
    note: str
    month: str


class OthersCreate(PublicationCreate):
    server: str
    peer_reviewed: bool
    link: str


class JournalCreate(PublicationCreate):
    pages: str
    journal: str
    volume: str
    note: str
    number: str
    month: str


