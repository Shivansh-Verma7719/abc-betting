export interface Sport {
  id: string;
  name: string;
  teams: string[];
}

export const SPORTS_DATA: Sport[] = [
  {
    id: 'football',
    name: 'Football',
    teams: [
      'Manchester United',
      'Manchester City',
      'Liverpool',
      'Chelsea',
      'Arsenal',
      'Tottenham',
      'Newcastle United'
    ]
  },
  {
    id: 'basketball',
    name: 'Basketball',
    teams: [
      'Los Angeles Lakers',
      'Golden State Warriors',
      'Boston Celtics',
      'Miami Heat',
      'Chicago Bulls',
      'Brooklyn Nets',
      'Phoenix Suns'
    ]
  },
  {
    id: 'cricket',
    name: 'Cricket',
    teams: [
      'Mumbai Indians',
      'Chennai Super Kings',
      'Royal Challengers Bangalore',
      'Delhi Capitals',
      'Kolkata Knight Riders',
      'Punjab Kings',
      'Rajasthan Royals'
    ]
  },
  {
    id: 'tennis',
    name: 'Tennis',
    teams: [
      'Novak Djokovic',
      'Rafael Nadal',
      'Roger Federer',
      'Carlos Alcaraz',
      'Daniil Medvedev',
      'Stefanos Tsitsipas',
      'Alexander Zverev'
    ]
  },
  {
    id: 'baseball',
    name: 'Baseball',
    teams: [
      'New York Yankees',
      'Los Angeles Dodgers',
      'Boston Red Sox',
      'Houston Astros',
      'Atlanta Braves',
      'San Francisco Giants',
      'Chicago Cubs'
    ]
  },
  {
    id: 'hockey',
    name: 'Ice Hockey',
    teams: [
      'Boston Bruins',
      'Tampa Bay Lightning',
      'Colorado Avalanche',
      'Vegas Golden Knights',
      'Toronto Maple Leafs',
      'New York Rangers',
      'Carolina Hurricanes'
    ]
  },
  {
    id: 'soccer',
    name: 'Soccer',
    teams: [
      'Real Madrid',
      'Barcelona',
      'Bayern Munich',
      'Paris Saint-Germain',
      'Manchester City',
      'Liverpool',
      'Juventus'
    ]
  }
];
