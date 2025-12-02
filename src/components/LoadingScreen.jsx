const LoadingScreen = () => {
    return (
        <div className="cyber-background loading">
            <div className="cyber-overlay"></div>
            <h1 className="neon-title">
                <i className="fa-solid fa-spinner fa-spin"></i>
                LOADING...
            </h1>
        </div>
    );
};

export default LoadingScreen;