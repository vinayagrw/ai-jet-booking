import logging
import sys
from logging.handlers import RotatingFileHandler, TimedRotatingFileHandler
import os
from datetime import datetime
import json

# Create logs directory if it doesn't exist
logs_dir = os.path.join(os.path.dirname(__file__), 'logs')
os.makedirs(logs_dir, exist_ok=True)

# Custom JSON formatter
class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        # Add extra fields if they exist
        if hasattr(record, 'extra'):
            log_record.update(record.extra)
            
        # Add exception info if it exists
        if record.exc_info:
            log_record['exception'] = self.formatException(record.exc_info)
            
        return json.dumps(log_record)

# Configure logging format
log_format = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s - [%(module)s:%(lineno)d]'
)

# Create a logger
def setup_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    # Console Handler with colored output
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(log_format)
    logger.addHandler(console_handler)

    # File Handler - Daily rotating log file
    log_file = os.path.join(logs_dir, f'app_{datetime.now().strftime("%Y%m%d")}.log')
    file_handler = RotatingFileHandler(
        log_file,
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    file_handler.setFormatter(log_format)
    logger.addHandler(file_handler)

    # JSON File Handler - For structured logging
    json_log_file = os.path.join(logs_dir, f'app_{datetime.now().strftime("%Y%m%d")}.json')
    json_handler = RotatingFileHandler(
        json_log_file,
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    json_handler.setFormatter(JsonFormatter())
    logger.addHandler(json_handler)

    # Error File Handler - Separate file for errors
    error_log_file = os.path.join(logs_dir, f'error_{datetime.now().strftime("%Y%m%d")}.log')
    error_handler = RotatingFileHandler(
        error_log_file,
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(log_format)
    logger.addHandler(error_handler)

    # Request Handler - For API requests
    request_log_file = os.path.join(logs_dir, f'requests_{datetime.now().strftime("%Y%m%d")}.log')
    request_handler = TimedRotatingFileHandler(
        request_log_file,
        when='midnight',
        interval=1,
        backupCount=30
    )
    request_handler.setFormatter(JsonFormatter())
    logger.addHandler(request_handler)

    return logger

# Create specific loggers for different components
api_logger = setup_logger('api')
db_logger = setup_logger('database')
auth_logger = setup_logger('auth')
request_logger = setup_logger('request')

# Log unhandled exceptions
def handle_exception(exc_type, exc_value, exc_traceback):
    if issubclass(exc_type, KeyboardInterrupt):
        sys.__excepthook__(exc_type, exc_value, exc_traceback)
        return
    
    api_logger.error("Uncaught exception", exc_info=(exc_type, exc_value, exc_traceback))

sys.excepthook = handle_exception

# Configure the logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
api_logger = logging.getLogger('api') 