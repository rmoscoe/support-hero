import React from 'react';
import { useTheme } from '../utils/ThemeContext';


function MetricCards({metrics}) {
    const { theme } = useTheme();
    return (
        <>
            {metrics.map((card, i) => (
                <div className={`${theme}-secondary-bg card is-flex-grow-1`} style={{ minWidth: '300px', minHeight: '300px' }} key={i}>
                    <div className={`card-header `}>
                        <h2 className={`${theme}-tertiary is-size-4 card-header-title is-centered`}>{card.title}</h2>
                    </div>
                    <p className='card-content'>{card.content}</p>
                </div>
            ))}
        </>

    )
};

export default MetricCards;