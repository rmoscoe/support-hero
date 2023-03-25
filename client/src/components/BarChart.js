import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";
import { useTheme } from '../utils/ThemeContext';

function Chart({data}){
    const { theme } = useTheme();
    const chartRef = useRef(null);
        useEffect(() => {
            const chart = Plot.plot({
                style: {
                    color: theme === 'light' ? "#1466e6" : "#58aceb",
                    background: theme === 'dark' ? "#313536" : "#ffffff",
                    border: theme === 'dark' ? "2px solid black" : "2px solid rgb(84, 84, 84)",
                    fontSize: 14,
                  },
                marks: [
                    Plot.barY(data, {x: data[0].rating ? "rating" : "issue", y: "count", fx: data[0].rating ? "Rating" : "Issue Type", fy: "Count"})
                  ]
            });
            chartRef.current.append(chart);
            return () => chart.remove();
        }, [data]);
return(
    <div ref={chartRef} />
);
}
export default Chart;
