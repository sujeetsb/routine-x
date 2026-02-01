import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface Props {
  percentage: number;
  radius?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
}

const ProgressRing: React.FC<Props> = ({
  percentage,
  radius = 60,
  strokeWidth = 10,
  color = '#4CAF50',
  bgColor = '#E0E0E0',
}) => {
  const circumference = 2 * Math.PI * (radius - strokeWidth / 2);
  const progress = (percentage / 100) * circumference;
  const strokeDashoffset = circumference - progress;

  return (
    <View style={styles.container}>
      <Svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${radius}, ${radius}`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ProgressRing;
