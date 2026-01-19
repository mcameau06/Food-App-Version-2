from sqlalchemy import create_engine,String,ForeignKey,DateTime
from sqlalchemy.orm import DeclarativeBase, mapped_column,relationship,Mapped,sessionmaker
from typing import List
from sqlalchemy.sql import func
from sqlalchemy.pool import NullPool
import os
import datetime 
from app.core.config import SUPABASE_DB_URL
db_dir  = os.path.dirname(os.path.abspath(__file__))
sql_file_name = "database.db"
sql_url = f'sqlite:///{os.path.join(db_dir,sql_file_name)}'

engine = create_engine(SUPABASE_DB_URL,echo=True,poolclass=NullPool)
#engine = create_engine(sql_url,echo=True)
session = sessionmaker(bind=engine,autoflush=False)

class Base(DeclarativeBase):
    pass

class Favorite(Base):
    __tablename__ = "favorites"

    id:Mapped[int] = mapped_column(primary_key=True)
    user_id:Mapped[str]  = mapped_column(ForeignKey("users.id"))
    restaurant_id = mapped_column(ForeignKey("restaurants.id"))
    created_at:Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True),server_default=func.now())
    
    restaurant_obj:Mapped["Restaurant"] = relationship(back_populates="favorites")
    user_obj:Mapped["User"] = relationship(back_populates="favorites")

    def __repr__(self) -> str:
        return f" Favorite(id={self.user_id!r} restaurant_id={self.restaurant_id!r}, created_at={self.created_at!r})"
    

class Restaurant(Base):

    __tablename__ = "restaurants"

    id:Mapped[int] = mapped_column(primary_key=True)
    google_place_id:Mapped[str] = mapped_column(String)
    name:Mapped[str]
    latitude:Mapped[float]
    longitude:Mapped[float]    

    favorites:Mapped[List["Favorite"]] = relationship(back_populates="restaurant_obj")

    def __repr__(self) -> str:
        return f"Restaurant {self.id!r} : {self.name!r}, place id: {self.google_place_id!r}, lat : {self.latitude!r} , lng : {self.longitude!r}"

class User(Base):
    __tablename__ = "users"

    id :Mapped[str] = mapped_column(primary_key=True)
    created_at:Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    favorites:Mapped[List["Favorite"]] = relationship(back_populates="user_obj")

    def __repr__(self) -> str:
        return f"User (id={self.id!r})"
    

    







