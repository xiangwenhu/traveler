interface Casts {
    date: string;
    week: string;
    dayweather: string;
    nightweather: string;
    daytemp: string;
    nighttemp: string;
    daywind: string;
    nightwind: string;
    daypower: string;
    nightpower: string;
    daytemp_float: string;
    nighttemp_float: string;
}
interface Forecasts {
    city: string;
    adcode: string;
    province: string;
    reporttime: string;
    casts: Casts[];
}
export interface ResWeather {
    status: string;
    count: string;
    info: string;
    infocode: string;
    forecasts: Forecasts[];
}