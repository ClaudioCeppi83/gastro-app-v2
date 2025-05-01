class MonitoringDashboard:
    def __init__(self, redis_conn):
        self.redis = redis_conn

    def generate_report(self):
        return {'redis_memory': self.redis.info()['used_memory']}

    def get_historical_metrics(self, hours):
        return []