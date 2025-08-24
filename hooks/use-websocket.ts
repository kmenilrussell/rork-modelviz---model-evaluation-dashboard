import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useModelStore } from './use-model-store';
import { Metric } from '@/types/model';

// Simulate WebSocket with periodic updates
export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { selectedModelId, updateMetric } = useModelStore();
  
  // Connect to WebSocket
  const connect = () => {
    if (isConnected || isConnecting) return;
    
    setIsConnecting(true);
    
    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      console.log('WebSocket connected');
    }, 1000);
  };
  
  // Disconnect from WebSocket
  const disconnect = () => {
    if (!isConnected) return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsConnected(false);
    console.log('WebSocket disconnected');
  };
  
  // Subscribe to model updates
  const subscribeToModel = (modelId: string) => {
    if (!isConnected) return;
    
    console.log(`Subscribing to model: ${modelId}`);
    
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Set up new interval for this model
    intervalRef.current = setInterval(() => {
      // Generate a random metric update
      const metricTypes = ['accuracy', 'latency', 'perplexity', 'toxicity', 'safety'] as const;
      const randomType = metricTypes[Math.floor(Math.random() * metricTypes.length)];
      
      // Base values depending on metric type
      let baseValue = 0;
      switch (randomType) {
        case 'accuracy':
          baseValue = 0.92;
          break;
        case 'latency':
          baseValue = 250;
          break;
        case 'perplexity':
          baseValue = 3.2;
          break;
        case 'toxicity':
          baseValue = 0.03;
          break;
        case 'safety':
          baseValue = 0.97;
          break;
      }
      
      // Add some random variation
      const variation = (Math.random() - 0.5) * 0.02;
      let value = baseValue + variation;
      
      // Ensure values stay within reasonable bounds
      if (randomType === 'accuracy' || randomType === 'safety' || randomType === 'toxicity') {
        value = Math.min(Math.max(value, 0), 1);
      } else if (randomType === 'latency') {
        value = Math.max(value, 10);
      } else if (randomType === 'perplexity') {
        value = Math.max(value, 1);
      }
      
      const newMetric: Metric = {
        id: `${modelId}-${randomType}-${new Date().toISOString()}`,
        modelId,
        type: randomType,
        value,
        timestamp: new Date().toISOString(),
      };
      
      // Update the store with the new metric
      updateMetric(newMetric);
      
    }, 5000); // Update every 5 seconds
  };
  
  // Unsubscribe from model updates
  const unsubscribeFromModel = (modelId: string) => {
    if (!isConnected) return;
    
    console.log(`Unsubscribing from model: ${modelId}`);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  // Connect on mount, disconnect on unmount
  useEffect(() => {
    // Only connect if we're not on web (to avoid issues with web compatibility)
    if (Platform.OS !== 'web') {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, []);
  
  // Subscribe to selected model
  useEffect(() => {
    if (!isConnected || !selectedModelId) return;
    
    subscribeToModel(selectedModelId);
    
    return () => {
      if (selectedModelId) {
        unsubscribeFromModel(selectedModelId);
      }
    };
  }, [isConnected, selectedModelId]);
  
  return {
    isConnected,
    isConnecting,
    connect,
    disconnect,
  };
};