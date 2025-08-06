export interface YearWinner {
  year: number;
  winnerCount: number;
}

export interface StudioWin {
  name: string;
  winCount: number;
}

export interface ProducerInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface MovieWinner {
  id: number;
  title: string;
  year: number;
  studios: string[];
  producers: string[];
  winner: boolean;
}
