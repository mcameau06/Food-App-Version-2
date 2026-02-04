from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from app.core.config import SUPABASE_JWT_SECRET

# HTTP bearer scheme for extracting the Supabase JWT from the Authorization header
http_bearer = HTTPBearer(auto_error=True)


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(http_bearer),
) -> str:
  """
  Validate the Supabase JWT and return the authenticated user's id (sub claim).
  """
  if not credentials or credentials.scheme.lower() != "bearer":
      raise HTTPException(
          status_code=status.HTTP_401_UNAUTHORIZED,
          detail="Invalid authentication scheme",
      )

  token = credentials.credentials

  try:
      # Supabase JWTs are signed with HS256 using SUPABASE_JWT_SECRET
      payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=["HS256"])
  except jwt.ExpiredSignatureError:
      raise HTTPException(
          status_code=status.HTTP_401_UNAUTHORIZED,
          detail="Token has expired",
      )
  except jwt.InvalidTokenError:
      raise HTTPException(
          status_code=status.HTTP_401_UNAUTHORIZED,
          detail="Invalid authentication token",
      )

  user_id = payload.get("sub")
  if not user_id:
      raise HTTPException(
          status_code=status.HTTP_401_UNAUTHORIZED,
          detail="Invalid token payload: missing subject",
      )

  return user_id

