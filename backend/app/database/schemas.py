from sqlalchemy import create_engine, text,MetaData, Table,Integer,String,Column,ForeignKey,DateTime,Float
from sqlalchemy.orm import Session, DeclarativeBase, mapped_column,relationship,Mapped,sessionmaker
from typing import List,Optional
from sqlalchemy.sql import func
import os
import datetime 
from config import Config 
from sqlalchemy.pool import NullPool
db_dir  = os.path.dirname(os.path.abspath(__file__))
sql_file_name = "database.db"
sql_url = f'sqlite:///{os.path.join(db_dir,sql_file_name)}'

#engine = create_engine(Config.SUPABASE_DB_URL,echo=True,poolclass=NullPool)
engine = create_engine(sql_url,echo=True)
session = sessionmaker(bind=engine,autoflush=False)

class Base(DeclarativeBase):
    pass


class Swipe(Base):
    __tablename__ = "swipes"

    id:Mapped[int] = mapped_column(primary_key=True)

    user_id:Mapped[str]  = mapped_column(ForeignKey("users.id"))
    restaurant_id = mapped_column(ForeignKey("restaurants.id"))
    swipe_direction:Mapped[str]
    swiped_at:Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True),server_default=func.now())
    
    restaurant_obj:Mapped["Restaurant"] = relationship(back_populates="swipes")
    user_obj:Mapped["User"] = relationship(back_populates="swipes")

    def __repr__(self) -> str:
        return f" Swiped (id={self.user_id!r} swiped={self.swipe_direction!r}, place={self.swiped_at!r})"
    

class Restaurant(Base):

    __tablename__ = "restaurants"

    id:Mapped[int] = mapped_column(primary_key=True)
    google_place_id:Mapped[str] = mapped_column(String)
    name:Mapped[str]
    latitude:Mapped[float]
    longitude:Mapped[float]    

    swipes:Mapped[List["Swipe"]] = relationship(back_populates="restaurant_obj")

    def __repr__(self) -> str:
        return f"Restaurant {self.id!r} : {self.name!r}, place id: {self.google_place_id!r}, lat : {self.latitude!r} , lng : {self.longitude!r}"

class User(Base):
    __tablename__ = "users"

    id :Mapped[str] = mapped_column(primary_key=True)
    created_at:Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    swipes:Mapped[List["Swipe"]] = relationship(back_populates="user_obj")

    def __repr__(self) -> str:
        return f"User (id={self.id!r})"
    

    







