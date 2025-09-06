export const defaultGoals = [
    {
        id: 'move',
        title: 'Move',
        emoji: '🏃',
        description: '20 min walk or 10k steps',
        progress: 0
    },
    {
        id: 'eat',
        title: 'Eat',
        emoji: '🍽',
        description: 'Healthy meals (no junk)',
        progress: 0
    },
    {
        id: 'calm',
        title: 'Calm',
        emoji: '😌',
        description: '10 min meditation',
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
