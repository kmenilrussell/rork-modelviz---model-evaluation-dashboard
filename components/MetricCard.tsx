import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { MetricSummary, MetricType } from '@/types/model';

interface MetricCardProps {
  metric: MetricSummary;
  onPress?: () => void;
  isSelected?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  metric, 
  onPress,
  isSelected = false,
}) => {
  const { type, value, change, trend } = metric;
  
  // Format the value based on metric type
  const formatValue = (type: MetricType, value: number): string => {
    switch (type) {
      case 'accuracy':
      case 'safety':
      case 'toxicity':
        return `${(value * 100).toFixed(1)}%`;
      case 'latency':
        return `${value.toFixed(1)}ms`;
      case 'perplexity':
        return value.toFixed(2);
      default:
        return value.toString();
    }
  };
  
  // Get color based on metric type
  const getColor = (type: MetricType): string => {
    switch (type) {
      case 'accuracy':
        return COLORS.accuracy;
      case 'latency':
        return COLORS.latency;
      case 'perplexity':
        return COLORS.perplexity;
      case 'toxicity':
        return COLORS.toxicity;
      case 'safety':
        return COLORS.safety;
      default:
        return COLORS.primary;
    }
  };
  
  // Get trend icon and color
  const getTrendIcon = () => {
    if (trend === 'up') {
      return <ArrowUp size={16} color={COLORS.success} />;
    } else if (trend === 'down') {
      return <ArrowDown size={16} color={COLORS.error} />;
    } else {
      return <Minus size={16} color={COLORS.text} />;
    }
  };
  
  // Format the title
  const formatTitle = (type: MetricType): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  // Format the change
  const formatChange = (type: MetricType, change: number): string => {
    switch (type) {
      case 'accuracy':
      case 'safety':
      case 'toxicity':
        return `${(change * 100).toFixed(1)}%`;
      case 'latency':
        return `${change.toFixed(1)}ms`;
      case 'perplexity':
        return change.toFixed(2);
      default:
        return change.toString();
    }
  };
  
  const color = getColor(type);
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        isSelected && { borderColor: color, borderWidth: 2 }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      testID={`metric-card-${type}`}
    >
      <View style={[styles.indicator, { backgroundColor: color }]} />
      <View style={styles.content}>
        <Text style={styles.title}>{formatTitle(type)}</Text>
        <Text style={styles.value}>{formatValue(type, value)}</Text>
        <View style={styles.changeContainer}>
          {getTrendIcon()}
          <Text style={styles.changeText}>
            {formatChange(type, change)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 8,
    flexDirection: 'row',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderColor: COLORS.border,
    borderWidth: 1,
    flex: 1,
    minWidth: 140,
  },
  indicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    color: COLORS.text,
    marginLeft: 4,
  },
});

export default MetricCard;