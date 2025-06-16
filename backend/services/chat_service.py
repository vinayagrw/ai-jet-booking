from typing import Dict, Any, List
import httpx
import logging
import json

logger = logging.getLogger(__name__)

class ChatService:
    def __init__(self, mcp_url: str = "http://localhost:3010"):
        self.mcp_url = mcp_url
        self.client = httpx.AsyncClient()
    
    async def close(self):
        await self.client.aclose()

    async def process_message(self, message: str, user_id: str) -> Dict[str, Any]:
        """Process a user message using the MCP server's AI Concierge."""
        try:
            # Call the MCP server's AI Concierge endpoint
            response = await self.client.post(
                f"{self.mcp_url}/ai/concierge",
                json={"message": message},
                timeout=30.0
            )
            
            response.raise_for_status()
            result = response.json()
            
            if not result.get("success", False):
                raise Exception(result.get("error", "Unknown error from MCP server"))
            
            # Format the response to match our expected format
            return {
                "status": "success",
                "response": {
                    "text": result.get("message", "I don't have a response for that."),
                    "data": result.get("data", {})
                },
                "metadata": {
                    "intent": result.get("intent", "unknown"),
                    "confidence": result.get("confidence", 1.0),
                    "entities": result.get("entities", {})
                }
            }
            
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error from MCP server: {str(e)}")
            return {
                "status": "error",
                "message": "The AI service is currently unavailable. Please try again later.",
                "error": str(e)
            }
        except Exception as e:
            logger.error(f"Error processing message with MCP: {str(e)}")
            return {
                "status": "error",
                "message": "Sorry, I encountered an error processing your request.",
                "error": str(e)
            }
    
    async def _handle_greeting(self, nlp_result: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        return {
            "text": "Hello! I'm your jet booking assistant. How can I help you today?"
        }
    
    async def _handle_book_jet(self, nlp_result: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        entities = nlp_result["entities"]
        
        # Prepare parameters for MCP
        params = {
            "user_id": user_id,
            "departure_city": entities.get("locations", [""])[0] if entities.get("locations") else None,
            "travel_date": entities.get("dates", [""])[0] if entities.get("dates") else None,
            "passenger_count": entities.get("passenger_count", 1)
        }
        
        # Call MCP to book the jet
        result = await mcp_client.execute_action(MCPActionType.BOOK_JET, params)
        
        if result.get("status") == "success":
            return {
                "text": f"✅ Your jet has been successfully booked! {result.get('data', {}).get('message', '')}",
                "data": result.get("data", {})
            }
        else:
            return {
                "text": "❌ Sorry, I couldn't complete your booking. Please try again later.",
                "error": result.get("message", "Unknown error")
            }
    
    async def _handle_check_booking(self, nlp_result: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        # Call MCP to get bookings
        result = await mcp_client.execute_action(MCPActionType.GET_BOOKINGS, {"user_id": user_id})
        
        if result.get("status") == "success" and result.get("data"):
            bookings = result["data"]
            response_text = "Here are your bookings:\n\n"
            
            for i, booking in enumerate(bookings, 1):
                response_text += (
                    f"{i}. Booking #{booking.get('booking_id', 'N/A')}\n"
                    f"   From: {booking.get('departure', 'N/A')}\n"
                    f"   To: {booking.get('destination', 'N/A')}\n"
                    f"   Date: {booking.get('date', 'N/A')}\n"
                    f"   Status: {booking.get('status', 'N/A')}\n\n"
                )
            
            return {
                "text": response_text,
                "data": bookings
            }
        else:
            return {
                "text": "You don't have any bookings yet.",
                "data": []
            }
    
    async def _handle_cancel_booking(self, nlp_result: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        # In a real implementation, you'd extract the booking ID from the message
        # For now, we'll just return a message
        return {
            "text": "To cancel a booking, please provide your booking ID.",
            "needs_more_info": True,
            "required_field": "booking_id"
        }
    
    async def _handle_get_jet_info(self, nlp_result: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        # Call MCP to get jet availability
        result = await mcp_client.execute_action(MCPActionType.GET_JET_AVAILABILITY, {})
        
        if result.get("status") == "success" and result.get("data"):
            jets = result["data"]
            response_text = "Here are the available jets:\n\n"
            
            for i, jet in enumerate(jets, 1):
                response_text += (
                    f"{i}. {jet.get('model', 'N/A')}\n"
                    f"   Capacity: {jet.get('capacity', 'N/A')} passengers\n"
                    f"   Range: {jet.get('range_miles', 'N/A')} miles\n"
                    f"   Status: {'✅ Available' if jet.get('available') else '❌ Not Available'}\n\n"
                )
            
            return {
                "text": response_text,
                "data": jets
            }
        else:
            return {
                "text": "❌ Sorry, I couldn't retrieve jet information. Please try again later.",
                "error": result.get("message", "Unknown error")
            }
    
    async def _handle_unknown(self, nlp_result: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        return {
            "text": "I'm not sure I understand. I can help you with booking a jet, checking your bookings, or providing information about available jets."
        }

# Singleton instance
chat_service = ChatService()
