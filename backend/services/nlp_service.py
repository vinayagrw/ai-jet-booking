from typing import Dict, Any, List, Tuple
import re
from enum import Enum

class IntentType(str, Enum):
    BOOK_JET = "book_jet"
    CHECK_BOOKING = "check_booking"
    CANCEL_BOOKING = "cancel_booking"
    GET_JET_INFO = "get_jet_info"
    GREETING = "greeting"
    UNKNOWN = "unknown"

class NLPService:
    def __init__(self):
        # Initialize any NLP models or configurations here
        self.patterns = {
            IntentType.BOOK_JET: [
                r"(book|reserve|schedule).*(jet|flight|trip)",
                r"i want to (book|reserve).*jet",
                r"schedule a flight"
            ],
            IntentType.CHECK_BOOKING: [
                r"(check|view|see) my (booking|reservation)",
                r"when is my (flight|trip)",
                r"(details|info) about my booking"
            ],
            IntentType.CANCEL_BOOKING: [
                r"cancel my (booking|reservation|flight)",
                r"i want to cancel",
                r"need to cancel"
            ],
            IntentType.GET_JET_INFO: [
                r"(what|which) jets are available",
                r"show me (jets|planes)",
                r"(list|show) available jets"
            ],
            IntentType.GREETING: [
                r"(hi|hello|hey|greetings)",
                r"good (morning|afternoon|evening)",
                r"how are you"
            ]
        }

    def extract_entities(self, text: str) -> Dict[str, Any]:
        """Extract entities from the user's text."""
        entities = {}
        
        # Extract dates (simple pattern, can be enhanced with dateparser)
        date_pattern = r"(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(tomorrow|today|next week|next month)"
        dates = re.findall(date_pattern, text, re.IGNORECASE)
        if dates:
            entities["dates"] = [d[0] if d[0] else d[1] for d in dates if d[0] or d[1]]
        
        # Extract locations (simple pattern, can be enhanced with NER)
        location_pattern = r"(from|to|in|at)\s+([A-Z][a-zA-Z\s]+?)(?=\s+(?:on|for|$))"
        locations = re.findall(location_pattern, text, re.IGNORECASE)
        if locations:
            entities["locations"] = [loc[1].strip() for loc in locations]
        
        # Extract number of passengers
        passenger_pattern = r"(\d+)\s+(passenger|person|people|adult|adults)"
        passenger_match = re.search(passenger_pattern, text, re.IGNORECASE)
        if passenger_match:
            entities["passenger_count"] = int(passenger_match.group(1))
            
        return entities

    def classify_intent(self, text: str) -> Tuple[IntentType, float]:
        """Classify the intent of the user's text with a confidence score."""
        text = text.lower()
        
        # Check for exact matches first
        for intent_type, patterns in self.patterns.items():
            for pattern in patterns:
                if re.search(pattern, text, re.IGNORECASE):
                    # Higher confidence for more specific patterns
                    confidence = min(1.0, 0.7 + (0.3 * (1 / (len(patterns) + 1))))
                    return intent_type, confidence
        
        # Default to unknown intent with low confidence
        return IntentType.UNKNOWN, 0.3

    def process_query(self, text: str) -> Dict[str, Any]:
        """Process the user query and return structured data."""
        intent, confidence = self.classify_intent(text)
        entities = self.extract_entities(text)
        
        return {
            "intent": intent.value,
            "confidence": confidence,
            "entities": entities,
            "original_text": text
        }

# Singleton instance
nlp_service = NLPService()
