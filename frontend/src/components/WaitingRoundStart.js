import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

const WaitingRoundStart = () => {

    return (
        <>
            <div className="flex items-center justify-center gap-5">
                <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".6s" />
                Waiting for round to start
            </div>
        </>
    );
}

export default WaitingRoundStart;
