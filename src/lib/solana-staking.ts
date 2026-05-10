// Solana staking and prize pool management
export type StakeInfo = {
  playerAddress: string;
  amount: number; // in SOL
  timestamp: number;
};

export type PrizePool = {
  totalAmount: number;
  hostStake: number;
  playerStakes: StakeInfo[];
  gamePin: string;
};

const PRIZE_POOLS_KEY = "meetstake:prize-pools";

export function createPrizePool(gamePin: string, hostStake: number): PrizePool {
  const pool: PrizePool = {
    totalAmount: hostStake,
    hostStake,
    playerStakes: [],
    gamePin,
  };
  
  savePrizePool(pool);
  return pool;
}

export function addPlayerStake(gamePin: string, playerAddress: string, amount: number): PrizePool | null {
  const pool = loadPrizePool(gamePin);
  if (!pool) return null;

  pool.playerStakes.push({
    playerAddress,
    amount,
    timestamp: Date.now(),
  });
  pool.totalAmount += amount;
  
  savePrizePool(pool);
  return pool;
}

export function distributePrizes(gamePin: string, winners: [string, string, string]): {
  first: { address: string; amount: number };
  second: { address: string; amount: number };
  third: { address: string; amount: number };
} | null {
  const pool = loadPrizePool(gamePin);
  if (!pool) return null;

  const total = pool.totalAmount;
  
  return {
    first: { address: winners[0], amount: total * 0.7 },
    second: { address: winners[1], amount: total * 0.2 },
    third: { address: winners[2], amount: total * 0.1 },
  };
}

function loadPrizePool(gamePin: string): PrizePool | null {
  if (typeof window === "undefined") return null;
  
  const raw = localStorage.getItem(`${PRIZE_POOLS_KEY}:${gamePin}`);
  return raw ? JSON.parse(raw) : null;
}

function savePrizePool(pool: PrizePool) {
  if (typeof window === "undefined") return;
  
  localStorage.setItem(`${PRIZE_POOLS_KEY}:${pool.gamePin}`, JSON.stringify(pool));
}

export function getPrizePool(gamePin: string): PrizePool | null {
  return loadPrizePool(gamePin);
}
