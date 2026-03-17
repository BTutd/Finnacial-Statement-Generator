import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useState, useEffect } from 'react';

const tickerData = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.84, change: 2.34 },
  { symbol: 'GOOGL', name: 'Alphabet', price: 141.56, change: -0.87 },
  { symbol: 'MSFT', name: 'Microsoft', price: 378.91, change: 4.12 },
  { symbol: 'AMZN', name: 'Amazon', price: 178.25, change: 1.56 },
  { symbol: 'TSLA', name: 'Tesla', price: 248.42, change: -3.21 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 875.28, change: 12.45 },
  { symbol: 'META', name: 'Meta', price: 505.75, change: 6.89 },
  { symbol: 'JPM', name: 'JPMorgan', price: 198.32, change: 1.23 },
];

function MiniChart({ positive }: { positive: boolean }) {
  const points = Array.from({ length: 20 }, (_, i) => {
    const trend = positive ? i * 1.2 : -i * 0.8;
    return 30 + trend + (Math.sin(i * 1.5) * 8) + (Math.random() * 6 - 3);
  });

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const normalized = points.map(p => ((p - min) / range) * 24);
  const pathD = normalized.map((y, i) => `${i === 0 ? 'M' : 'L'}${i * 4},${28 - y}`).join(' ');

  return (
    <svg width="76" height="28" viewBox="0 0 76 28" className="opacity-70">
      <motion.path
        d={pathD}
        fill="none"
        stroke={positive ? 'hsl(var(--accent))' : 'hsl(var(--destructive))'}
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
    </svg>
  );
}

function TickerCard({ item, index }: { item: typeof tickerData[0]; index: number }) {
  const [price, setPrice] = useState(item.price);
  const [change, setChange] = useState(item.change);
  const positive = change >= 0;

  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.48) * 2;
      setPrice(prev => +(prev + delta).toFixed(2));
      setChange(prev => +(prev + delta * 0.3).toFixed(2));
    }, 2000 + index * 500);
    return () => clearInterval(interval);
  }, [index]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ scale: 1.05, y: -4 }}
      className="flex-shrink-0 w-52 p-4 rounded-xl bg-card/80 backdrop-blur border border-border hover:border-accent/40 transition-colors cursor-default select-none"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-display font-bold text-foreground text-sm">{item.symbol}</span>
        {positive ? (
          <TrendingUp className="h-3.5 w-3.5 text-accent" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5 text-destructive" />
        )}
      </div>
      <MiniChart positive={positive} />
      <div className="flex items-end justify-between mt-2">
        <motion.span
          key={price}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          className="font-display text-lg font-bold text-foreground"
        >
          ${price.toLocaleString()}
        </motion.span>
        <motion.span
          key={change}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          className={`text-xs font-medium ${positive ? 'text-accent' : 'text-destructive'}`}
        >
          {positive ? '+' : ''}{change.toFixed(2)}%
        </motion.span>
      </div>
    </motion.div>
  );
}

export function AnimatedTicker({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="w-full overflow-hidden py-4">
      <motion.div
        className="flex gap-4"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {[...tickerData, ...tickerData].map((item, i) => (
          <TickerCard key={`${item.symbol}-${i}`} item={item} index={i % tickerData.length} />
        ))}
      </motion.div>
    </div>
  );
}
