from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from typing import Dict, Any
import logging
from pydantic import BaseModel
from backend.services.chat_service import ChatService

logger = logging.getLogger(__name__)

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Create a single instance of the chat service
chat_service = ChatService()

@router.on_event("shutdown")
async def shutdown_event():
    """Clean up resources when the application shuts down."""
    await chat_service.close()

class ChatMessage(BaseModel):
    message: str
    user_id: str  # In a real app, this would come from the auth token

@router.post("/chat/message")
async def process_chat_message(chat_message: ChatMessage, request: Request):
    """
    Process a chat message using the MCP server's AI Concierge.
    """
    try:
        # In a real application, you would validate the user's token here
        # and get the user_id from it
        user_id = chat_message.user_id
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not authenticated"
            )
        
        # Process the message
        response = await chat_service.process_message(
            message=chat_message.message,
            user_id=user_id
        )
        
        # Add CORS headers
        request_origin = request.headers.get('origin')
        if request_origin:
            response_headers = dict(response.get('headers', {}))
            response_headers.update({
                'Access-Control-Allow-Origin': request_origin,
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            })
            response['headers'] = response_headers
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing chat message: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error processing your message"
        )
