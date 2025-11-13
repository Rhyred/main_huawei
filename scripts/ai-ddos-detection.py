#!/usr/bin/env python3
"""
HuaPau AI DDoS Detection System
Advanced machine learning-based DDoS attack detection
"""

import json
import sys
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

class HuaPauAIDDoSDetector:
    def __init__(self):
        self.model = IsolationForest(
            contamination=0.1,
            random_state=42,
            n_estimators=100
        )
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_names = [
            'packets_per_second',
            'bytes_per_second', 
            'connections_per_second',
            'unique_ips',
            'avg_packet_size',
            'connection_duration_avg'
        ]
        
    def generate_training_data(self, samples=1000):
        """Generate synthetic training data for DDoS detection"""
        np.random.seed(42)
        
        # Normal traffic patterns
        normal_data = []
        for _ in range(int(samples * 0.9)):
            normal_data.append([
                np.random.normal(100, 20),      # packets_per_second
                np.random.normal(50000, 10000), # bytes_per_second
                np.random.normal(10, 3),        # connections_per_second
                np.random.normal(50, 15),       # unique_ips
                np.random.normal(500, 100),     # avg_packet_size
                np.random.normal(30, 10)        # connection_duration_avg
            ])
        
        # Attack patterns
        attack_data = []
        for _ in range(int(samples * 0.1)):
            attack_type = np.random.choice(['syn_flood', 'udp_flood', 'http_flood'])
            
            if attack_type == 'syn_flood':
                attack_data.append([
                    np.random.normal(1000, 200),    # High packets
                    np.random.normal(100000, 20000), # High bytes
                    np.random.normal(100, 20),      # High connections
                    np.random.normal(20, 5),        # Low unique IPs
                    np.random.normal(100, 20),      # Small packets
                    np.random.normal(1, 0.5)        # Short duration
                ])
            elif attack_type == 'udp_flood':
                attack_data.append([
                    np.random.normal(2000, 300),    # Very high packets
                    np.random.normal(200000, 40000), # Very high bytes
                    np.random.normal(50, 10),       # Medium connections
                    np.random.normal(10, 3),        # Very low unique IPs
                    np.random.normal(100, 30),      # Small packets
                    np.random.normal(0.5, 0.2)      # Very short duration
                ])
            else:  # http_flood
                attack_data.append([
                    np.random.normal(500, 100),     # Medium packets
                    np.random.normal(150000, 30000), # High bytes
                    np.random.normal(200, 50),      # Very high connections
                    np.random.normal(30, 8),        # Low unique IPs
                    np.random.normal(300, 50),      # Medium packets
                    np.random.normal(5, 2)          # Short duration
                ])
        
        # Combine and shuffle
        all_data = normal_data + attack_data
        labels = [1] * len(normal_data) + [-1] * len(attack_data)
        
        return np.array(all_data), np.array(labels)
    
    def train_model(self):
        """Train the AI model with synthetic data"""
        try:
            X_train, y_train = self.generate_training_data()
            
            # Fit scaler and transform data
            X_scaled = self.scaler.fit_transform(X_train)
            
            # Train model
            self.model.fit(X_scaled)
            self.is_trained = True
            
            return {
                'success': True,
                'message': 'AI model trained successfully',
                'training_samples': len(X_train),
                'features': self.feature_names
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Training failed: {str(e)}'
            }
    
    def detect_ddos(self, traffic_data):
        """Detect DDoS attacks in traffic data"""
        if not self.is_trained:
            train_result = self.train_model()
            if not train_result['success']:
                return train_result
        
        try:
            # Prepare features
            features = np.array([[
                traffic_data.get('packets_per_second', 0),
                traffic_data.get('bytes_per_second', 0),
                traffic_data.get('connections_per_second', 0),
                traffic_data.get('unique_ips', 0),
                traffic_data.get('avg_packet_size', 0),
                traffic_data.get('connection_duration_avg', 0)
            ]])
            
            # Scale features
            features_scaled = self.scaler.transform(features)
            
            # Predict
            prediction = self.model.predict(features_scaled)[0]
            anomaly_score = self.model.decision_function(features_scaled)[0]
            
            # Convert to probability (0-100%)
            threat_probability = max(0, min(100, (1 - anomaly_score) * 50))
            
            # Determine attack type based on features
            attack_type = self._classify_attack_type(traffic_data)
            
            # Determine severity
            if threat_probability > 80:
                severity = 'Critical'
            elif threat_probability > 60:
                severity = 'High'
            elif threat_probability > 40:
                severity = 'Medium'
            else:
                severity = 'Low'
            
            return {
                'success': True,
                'is_attack': prediction == -1,
                'threat_probability': round(threat_probability, 2),
                'anomaly_score': round(anomaly_score, 4),
                'attack_type': attack_type,
                'severity': severity,
                'confidence': round(abs(anomaly_score) * 100, 2),
                'timestamp': datetime.now().isoformat(),
                'features_analyzed': self.feature_names,
                'model_info': {
                    'algorithm': 'Isolation Forest',
                    'trained': self.is_trained,
                    'version': '1.0.0'
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Detection failed: {str(e)}'
            }
    
    def _classify_attack_type(self, traffic_data):
        """Classify the type of attack based on traffic patterns"""
        pps = traffic_data.get('packets_per_second', 0)
        bps = traffic_data.get('bytes_per_second', 0)
        cps = traffic_data.get('connections_per_second', 0)
        unique_ips = traffic_data.get('unique_ips', 0)
        avg_size = traffic_data.get('avg_packet_size', 0)
        
        # Classification logic
        if pps > 1500 and avg_size < 200 and cps > 80:
            return 'SYN Flood'
        elif pps > 1800 and bps > 180000 and unique_ips < 15:
            return 'UDP Flood'
        elif cps > 150 and bps > 120000:
            return 'HTTP Flood'
        elif pps > 800 and unique_ips < 20:
            return 'Volumetric Attack'
        elif cps > 50 and unique_ips > 100:
            return 'Distributed Attack'
        elif avg_size > 1000 and pps > 500:
            return 'Amplification Attack'
        else:
            return 'Unknown Pattern'

def main():
    """Main function for command line usage"""
    if len(sys.argv) < 2:
        print(json.dumps({
            'success': False,
            'message': 'Usage: python ai-ddos-detection.py <traffic_data_json>'
        }))
        return
    
    try:
        # Parse input data
        traffic_data = json.loads(sys.argv[1])
        
        # Initialize detector
        detector = HuaPauAIDDoSDetector()
        
        # Perform detection
        result = detector.detect_ddos(traffic_data)
        
        # Output result
        print(json.dumps(result, indent=2))
        
    except json.JSONDecodeError:
        print(json.dumps({
            'success': False,
            'message': 'Invalid JSON input'
        }))
    except Exception as e:
        print(json.dumps({
            'success': False,
            'message': f'Error: {str(e)}'
        }))

if __name__ == '__main__':
    main()
