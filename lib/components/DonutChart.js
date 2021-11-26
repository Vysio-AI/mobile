import React from 'react';
import {PieChart} from 'react-native-svg-charts';
import tailwind from 'tailwind-rn';

export default function DonutChart() {
  const data = [50, 10]

  const randomColor = () => ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7)

  const pieData = data
      .filter((value) => value > 0)
      .map((value, index) => ({
          value,
          svg: {
              fill: '#FFFFFF',
              onPress: () => console.log('press', index),
          },
          key: `pie-${index}`,
      }))

  return <PieChart style={tailwind('h-10 w-10 mx-1 my-1')} data={pieData} />
}
