import logging
from logging.handlers import RotatingFileHandler
from datetime import datetime

class UnifiedLogger:
    def __init__(self):
        self.logger = logging.getLogger('POS_Logger')
        self.logger.setLevel(logging.INFO)
        
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        
        # Handler para archivo
        file_handler = RotatingFileHandler('pos.log', maxBytes=1024*1024*5, backupCount=3)
        file_handler.setFormatter(formatter)
        
        # Handler para consola
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        
        self.logger.addHandler(file_handler)
        self.logger.addHandler(console_handler)
    
    def log_transaction(self, message: str, system: str):
        self.logger.info(f"[{system}] {message}")
    
    def log_error(self, error: Exception, context: str):
        self.logger.error(f"Error en {context}: {str(error)}", exc_info=True)

# Configuración inicial
def setup_logging():
    return UnifiedLogger()

'''
Ejemplo de uso:
logger = setup_logging()
logger.log_transaction("Orden creada exitosamente", "Sistema POS")
'''