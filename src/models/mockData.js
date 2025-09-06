export const defaultGoals = [
    {
        id: 'move',
        category: 'Physical',
        title: 'Move',
        emoji: '🏃',
        description: '20 min walk or 10k steps',
        progress: 0
    },
    {
        id: 'strength',
        category: 'Physical',
        title: 'Strength',
        emoji: '💪',
        description: '15 min strength training',
        progress: 0
    },
    {
        id: 'eat',
        category: 'Nutrition',
        title: 'Eat Well',
        emoji: '🍽',
        description: 'Healthy balanced meals',
        progress: 0
    },
    {
        id: 'water',
        category: 'Nutrition',
        title: 'Hydrate',
        emoji: '💧',
        description: 'Drink 8 glasses of water',
        progress: 0
    },
    {
        id: 'calm',
        category: 'Mental',
        title: 'Meditate',
        emoji: '😌',
        description: '10 min meditation',
        progress: 0
    },
    {
        id: 'sleep',
        category: 'Mental',
        title: 'Sleep',
        emoji: '😴',
        description: '7-8 hours of sleep',
        progress: 0
    }
];

export const defaultProgress = {
    today: 0,
    week: 0,
    month: 0
};

export const riskMock = {
    Cardio: 0.2,
    Neuro: 0.35,
    Respiratory: 0.25,
    Digestive: 0.15,
    Metabolic: 0.4
};
