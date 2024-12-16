import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';

const WaitingRoundStart = () => {

    const content = (
        <div className='flex justify-center items-center gap-4'>
            <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" animationDuration=".7s" />
            Waiting for round to start
        </div>
    )

    return (
        <>
            <div className="flex items-center justify-center gap-5">
                <Message
                    style={{
                        border: 'solid #696cff',
                        borderWidth: '0 0 0 6px',
                        color: '#696cff'
                    }}
                    className="border-primary w-full content-start"
                    severity="info"
                    content={content}
                />
            </div>
        </>
    );
}

export default WaitingRoundStart;
