export const getHealth = (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'BudgedIn API is healthy',
        timestamp: new Date().toISOString()
    });
};
