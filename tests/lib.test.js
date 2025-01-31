import { expect, test, describe } from "vitest";
import {
    adaptColorToBackground,
    addVector,
    calcLinearProgression,
    calcMedian,
    calcPercentageTrend,
    calcPolygonPoints,
    calcStarPoints,
    calculateNiceScale,
    checkArray,
    checkNaN,
    checkObj,
    closestDecimal,
    convertColorToHex,
    createArc,
    createPolygonPath,
    createSmoothPath,
    createStar,
    dataLabel,
    degreesToRadians,
    hslToRgb,
    interpolateColorHex,
    isSafeValue,
    isValidUserValue,
    makeDonut,
    makePath,
    matrixTimes,
    niceNum,
    rotateMatrix,
    shiftHue,
    sumByAttribute,
    treeShake,
} from "../src/lib"

describe('degreesToRadians', () => {
    test('converts degrees to radians', () => {
        expect(degreesToRadians(1)).toBe(0.017453292519943295)
    });
})

describe("checkNaN", () => {
    test('returns 0 if isNaN', () => {
        expect(checkNaN(NaN)).toBe(0);
        expect(checkNaN(undefined)).toBe(0);
        expect(checkNaN('text')).toBe(0);
    });

    test("returns 1 if is NaN", () => {
        expect(checkNaN(NaN, 1)).toBe(1);
        expect(checkNaN(undefined, 1)).toBe(1);
        expect(checkNaN('text', 1)).toBe(1);
    })

    test('returns the input', () => {
        expect(checkNaN(1)).toBe(1);
        expect(checkNaN(-1)).toBe(-1);
        expect(checkNaN('1')).toBe("1");
        expect(checkNaN('-1')).toBe("-1");
        expect(checkNaN(null)).toBe(null);
        expect(checkNaN(false)).toBe(false);
        expect(checkNaN(Infinity)).toBe(Infinity);
        expect(checkNaN(-Infinity)).toBe(-Infinity);
    });
})

describe('isSafeValue', () => {
    test('returns true if value is safe', () => {
        expect(isSafeValue(1)).toBe(true);
        expect(isSafeValue("1")).toBe(true);
        expect(isSafeValue(-1)).toBe(true);
        expect(isSafeValue("-1")).toBe(true);
        expect(isSafeValue("text")).toBe(true);
        expect(isSafeValue(null)).toBe(true);
    });

    test('returns false if value is unsafe', () => {
        expect(isSafeValue(undefined)).toBe(false);
        expect(isSafeValue(NaN)).toBe(false);
        expect(isSafeValue(Infinity)).toBe(false);
        expect(isSafeValue(-Infinity)).toBe(false);
    });
})

describe('isValidUserValue', () => {
    test('returns true if value is valid user value', () => {
        expect(isValidUserValue(1)).toBe(true);
        expect(isValidUserValue(-1)).toBe(true);
        expect(isValidUserValue('1')).toBe(true);
        expect(isValidUserValue('-1')).toBe(true);
        expect(isValidUserValue('text')).toBe(true);
        expect(isValidUserValue([])).toBe(true);
        expect(isValidUserValue([1, 2])).toBe(true);
        expect(isValidUserValue(["1", "2"])).toBe(true);
        expect(isValidUserValue({})).toBe(true);
        expect(isValidUserValue({ key: "value" })).toBe(true);
    });

    test('returns false if value is not valid user value', () => {
        expect(isValidUserValue(undefined)).toBe(false);
        expect(isValidUserValue(null)).toBe(false);
        expect(isValidUserValue(NaN)).toBe(false);
        expect(isValidUserValue(Infinity)).toBe(false);
        expect(isValidUserValue(-Infinity)).toBe(false);
    });
})


describe('checkObj', () => {
    test('returns true if input is a nested object', () => {
        const userConfig = { key: { subKey0: { subKey1: 'value' } } };
        const key = "key";
        expect(checkObj({ userConfig, key })).toBe(true);
    });
    test('returns false if input is not an object and not a nested object', () => {
        const userConfig = { key: 'value' };
        const key = "key";
        expect(checkObj({ userConfig, key })).toBe(false);
    });
})


describe('checkArray', () => {
    test('returns true if input is an abject containing an array', () => {
        const userConfig = { key: ['value'] };
        const key = "key";
        expect(checkArray({ userConfig, key })).toBe(true);
    });
    test('returns false if input is an object not containing an array', () => {
        const key = "key";
        let userConfig = { key: 'value' };
        expect(checkArray({ userConfig, key })).toBe(false);
        userConfig = { key: { subKey: 'value' } };
        expect(checkArray({ userConfig, key })).toBe(false);
        userConfig = { key: {} };
        expect(checkArray({ userConfig, key })).toBe(false);
        userConfig = { key: 1 };
        expect(checkArray({ userConfig, key })).toBe(false);
    });
})

describe('treeShake', () => {
    test('returns default config if user config is missing', () => {
        const defaultConfig = {
            key1: "val1",
            key2: {
                subkey: "subkey"
            },
            key3: {
                subkey: {
                    subsubkey: "subsubkey"
                }
            }
        };

        const userConfig0 = {};

        const userConfig1 = {
            key1: ""
        };

        const userConfig2 = {
            key1: "test"
        };

        const userConfig3 = {
            key3: {
                subkey: {
                    subsubkey: "test"
                }
            }
        };

        expect(treeShake({ defaultConfig, userConfig: userConfig0 })).toStrictEqual({
            key1: "val1",
            key2: {
                subkey: "subkey"
            },
            key3: {
                subkey: {
                    subsubkey: "subsubkey"
                }
            }
        });

        expect(treeShake({ defaultConfig, userConfig: userConfig1 })).toStrictEqual({
            key1: "",
            key2: {
                subkey: "subkey"
            },
            key3: {
                subkey: {
                    subsubkey: "subsubkey"
                }
            }
        });

        expect(treeShake({ defaultConfig, userConfig: userConfig2 })).toStrictEqual({
            key1: "test",
            key2: {
                subkey: "subkey"
            },
            key3: {
                subkey: {
                    subsubkey: "subsubkey"
                }
            }
        });

        expect(treeShake({ defaultConfig, userConfig: userConfig3 })).toStrictEqual({
            key1: "val1",
            key2: {
                subkey: "subkey"
            },
            key3: {
                subkey: {
                    subsubkey: "test"
                }
            }
        });
    });
})

describe('adaptColorToBackground', () => {
    test('returns a light color for a dark background', () => {
        const backgroundColor = "#1A1A1A";
        expect(adaptColorToBackground(backgroundColor)).toBe('#FFFFFF')
        const backgroundColor2 = "#6A6A6A";
        expect(adaptColorToBackground(backgroundColor2)).toBe('#FFFFFF')
    });
    test('returns a dark color for a light background', () => {
        const backgroundColor = "#FFFFFF";
        expect(adaptColorToBackground(backgroundColor)).toBe('#000000')
        const backgroundColor2 = "#BBBBBB";
        expect(adaptColorToBackground(backgroundColor2)).toBe('#000000')
    })
})

describe('convertColorToHex', () => {
    test('returns HEX color format from RGB', () => {
        expect(convertColorToHex("rgb(255,0,0)")).toBe("#ff0000");
        expect(convertColorToHex("rgb(0,255,0)")).toBe("#00ff00");
        expect(convertColorToHex('rgb(0,0,255)')).toBe("#0000ff");
        expect(convertColorToHex("rgb(0,0,0)")).toBe("#000000");
        expect(convertColorToHex("rgb(255,255,255)")).toBe("#ffffff");
    });

    test('returns HEX color format from HSL', () => {
        expect(convertColorToHex("hsl(0,100%,50%)")).toBe("#ff0000");
        expect(convertColorToHex("hsl(120,100%,50%)")).toBe("#00ff00");
        expect(convertColorToHex("hsl(240,100%,50%)")).toBe("#0000ff");
        expect(convertColorToHex("hsl(0,0%,0%)")).toBe("#000000");
        expect(convertColorToHex("hsl(0,0%,100%)")).toBe("#ffffff");
    });

    test('returns HEX color from an HSL passed through hslToRgb', () => {
        const rgb = hslToRgb(50, 50, 50);
        expect(convertColorToHex(`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`)).toBe('#bfaa40')
    })
})

describe('shiftHue', () => {
    test('takes a HEX color and returns a shifted HEX color', () => {
        expect(shiftHue('#6376DD', 0.1)).toBe('#9963dd')
        expect(shiftHue('#9963dd', 0.1)).toBe('#dd63d8')
        expect(shiftHue('#dd63d8', 0.1)).toBe('#dd638f')
        expect(shiftHue('#dd638f', 0.1)).toBe('#dd8063')
        expect(shiftHue('#dd8063', 0.1)).toBe('#ddc963')
        expect(shiftHue('#ddc963', 0.1)).toBe('#a8dd63')
        expect(shiftHue('#a8dd63', 0.1)).toBe('#63dd67')
        expect(shiftHue('#63dd67', 0.1)).toBe('#63ddb0')
        expect(shiftHue('#63ddb0', 0.1)).toBe('#63c1dd')
        expect(shiftHue('#63c1dd', 0.1)).toBe('#6378dd')
    })
})

describe('hslToRgb', () => {
    test('converts hsl to RGB', () => {
        expect(hslToRgb(50, 50, 50)).toStrictEqual([191, 170, 64])
    })
})

describe('sumByAttribute', () => {
    test('sums a specific attribute in an array of objects', () => {
        const arr = [
            {
                attr1: 1,
                attr2: 2
            },
            {
                attr1: 1,
                attr2: 2
            },
            {
                attr1: 1,
                attr2: 2
            }
        ]
        expect(sumByAttribute(arr, 'attr1')).toBe(3)
        expect(sumByAttribute(arr, 'attr2')).toBe(6)
    })
})

describe('closestDecimal', () => {
    test('returns the closest decimal of a number', () => {
        expect(closestDecimal(12)).toBe(10)
        expect(closestDecimal(15)).toBe(20)
        expect(closestDecimal(19)).toBe(20)
        expect(closestDecimal(21)).toBe(20)
        expect(closestDecimal(99)).toBe(100)
        expect(closestDecimal(150)).toBe(200)
        expect(closestDecimal(1500)).toBe(2000);

    })
    test('returns the same number from 0 to 10', () => {
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((num) => {
            expect(closestDecimal(num)).toBe(num)
        })
    })
})

describe('makeDonut', () => {
    test('it creates a donut object', () => {
        const item = {
            base: 100,
            series: [
                { value: 1 },
                { value: 2 },
                { value: 3 },
            ]
        }
        const cx = 100;
        const cy = 100;
        const rx = 10;
        const ry = 10;

        const donut = makeDonut(item, cx, cy, rx, ry);

        expect(donut).toStrictEqual(
            [
                {
                    arcSlice: 'M100.06646055814842 90.00022085272826 A 10 10 6030.380793751915 0 1 108.69326717473096 95.05762144016212 L 108.69326717473096 95.05762144016212 M108.69326717473096 95.05762144016212 A 10 10 6030.380793751915 0 0 100.06646055814842 90.00022085272826 L 100.06646055814842 90.00022085272826',
                    cx: 100,
                    cy: 100,
                    value: 1,
                    proportion: 0.16666666666666666,
                    ratio: 1.0471923152088416,
                    path: 'M100.06646055814842 90.00022085272826 A 10 10 6030.380793751915 0 1 108.69326717473096 95.05762144016212',
                    startX: 100.06646055814842,
                    startY: 90.00022085272826,
                    endX: 108.69326717473096,
                    endY: 95.05762144016212,
                    center: {
                        startX: 100.09636780931521,
                        startY: 85.50032023645599,
                        endX: 107.33329685274603,
                        endY: 87.49109288268934,
                        path: 'M100.09636780931521 85.50032023645599 A 14.5 14.5 6030.380793751915 0 1 107.33329685274603 87.49109288268934'
                    }
                },
                {
                    arcSlice: 'M108.69326717473096 95.05762144016212 A 10 10 6030.380793751915 0 1 99.93369651802331 109.99978018999806 L 99.93369651802331 109.99978018999806 M99.93369651802331 109.99978018999806 A 10 10 6030.380793751915 0 0 108.69326717473096 95.05762144016212 L 108.69326717473096 95.05762144016212',
                    cx: 100,
                    cy: 100,
                    value: 2,
                    proportion: 0.3333333333333333,
                    ratio: 2.094384630417683,
                    path: 'M108.69326717473096 95.05762144016212 A 10 10 6030.380793751915 0 1 99.93369651802331 109.99978018999806',
                    startX: 108.69326717473096,
                    startY: 95.05762144016212,
                    endX: 99.93369651802331,
                    endY: 109.99978018999806,
                    center: {
                        startX: 112.6052374033599,
                        startY: 92.83355108823508,
                        endX: 112.50894551419171,
                        endY: 107.33323135616101,
                        path: 'M112.6052374033599 92.83355108823508 A 14.5 14.5 6030.380793751915 0 1 112.50894551419171 107.33323135616101'
                    }
                },
                {
                    arcSlice: 'M99.93369651802331 109.99978018999806 A 10 10 6030.380793751915 0 1 100.06614640578861 90.00021876974294 L 100.06614640578861 90.00021876974294 M100.06614640578861 90.00021876974294 A 10 10 6030.380793751915 0 0 99.93369651802331 109.99978018999806 L 99.93369651802331 109.99978018999806',
                    cx: 100,
                    cy: 100,
                    value: 3,
                    proportion: 0.5,
                    ratio: 3.1415769456265252,
                    path: 'M99.93369651802331 109.99978018999806 A 10 10 6030.380793751915 0 1 100.06614640578861 90.00021876974294',
                    startX: 99.93369651802331,
                    startY: 109.99978018999806,
                    endX: 100.06614640578861,
                    endY: 90.00021876974294,
                    center: {
                        startX: 99.9038599511338,
                        startY: 114.4996812754972,
                        endX: 85.5003187245028,
                        endY: 99.9038599511338,
                        path: 'M99.9038599511338 114.4996812754972 A 14.5 14.5 6030.380793751915 0 1 85.5003187245028 99.9038599511338'
                    }
                }
            ]
        )
    })
})

describe("createArc", () => {
    test('creates an arc object', () => {
        const arc = createArc(
            [100, 100],
            [100, 100],
            [0, 1],
            100
        );

        expect(arc).toStrictEqual({
            startX: 186.2318872287684,
            startY: 49.36343588902412,
            endX: 189.200486978816,
            endY: 145.20257871783505,
            path: 'M186.2318872287684 49.36343588902412 A 100 100 5729.577951308232 0 1 189.200486978816 145.20257871783505'
        })
    })
})

describe('addVector', () => {
    test('adds two vectors', () => {
        const vector1 = [1, 2];
        const vector2 = [3, 4];
        const fusedVector = addVector(vector1, vector2);
        expect(fusedVector).toStrictEqual([4, 6])
    })
})

describe('matrixTimes', () => {
    test('factors a matrix', () => {
        const vector1 = [2, 2];
        const vector2 = [3, 3];
        const coordinates = [5, 5];
        const factorizedMatrix = matrixTimes([vector1, vector2], coordinates);
        expect(factorizedMatrix).toStrictEqual([20, 30])
    })
})

describe('rotateMatrix', () => {
    test('rotates a matrix from a number', () => {
        expect(rotateMatrix(1)).toStrictEqual([
            [0.5403023058681398, -0.8414709848078965],
            [0.8414709848078965, 0.5403023058681398]
        ])
    })
})

describe('calcPolygonPoints', () => {
    test('creates a triangle object with usable svg path & coordinates', () => {
        const triangle = {
            centerX: 100,
            centerY: 100,
            outerPoints: 1.5,
            radius: 30,
            rotation: 0
        }

        expect(calcPolygonPoints({ ...triangle }).coordinates.length).toBe(triangle.outerPoints * 2)
        expect(calcPolygonPoints({ ...triangle })).toStrictEqual({
            path: 'M130,100 85,125.98076211353316 84.99999999999999,74.01923788646684 Z',
            coordinates: [
                { x: 130, y: 100 },
                { x: 85, y: 125.98076211353316 },
                { x: 84.99999999999999, y: 74.01923788646684 }
            ]
        })
    })
    test('creates a rectangle object with usable svg path & coordinates', () => {
        const rect = {
            centerX: 100,
            centerY: 100,
            outerPoints: 2,
            radius: 30,
            rotation: 0
        }

        expect(calcPolygonPoints({ ...rect }).coordinates.length).toBe(rect.outerPoints * 2)
        expect(calcPolygonPoints({ ...rect })).toStrictEqual({
            path: 'M130,100 100,130 70,100 100,70 Z',
            coordinates: [
                { x: 130, y: 100 },
                { x: 100, y: 130 },
                { x: 70, y: 100 },
                { x: 100, y: 70 }
            ]
        })
    })
})

describe('createPolygonPath', () => {
    test('creates a polygon path object from plot coordinates', () => {
        const obj = {
            plot: { x: 100, y: 100 },
            radius: 30,
            sides: 3,
            rotation: 0
        }

        expect(createPolygonPath({ ...obj }).coordinates.length).toBe(obj.sides)
        expect(createPolygonPath({ ...obj })).toStrictEqual({
            path: 'M131,100 84.5,126.84678751731761 84.49999999999999,73.1532124826824 Z',
            coordinates: [
                { x: 131, y: 100 },
                { x: 84.5, y: 126.84678751731761 },
                { x: 84.49999999999999, y: 73.1532124826824 }
            ]
        })
    })
})

describe('calcStarPoints', () => {
    test('creates star points with a trailing blank space ready to be passed to a polygon svg object', () => {
        const star = {
            centerX: 100,
            centerY: 100,
            innerCirclePoints: 5,
            innerRadius: (30 * 3.5) / 5,
            outerRadius: ((30 * 3.5) / 5) * 2
        }

        expect(calcStarPoints({ ...star })).toEqual('59.99865482256344,87.1979539137069 87.58154292114362,83.06536319312983 99.81437389459367,58.00041020499139 112.26828240498303,82.9562549059315 139.88662193509617,86.84487207942455 120.00067258871826,106.40102304314662 124.83691415771287,133.86927361374026 100.09281305270324,120.9997948975043 75.46343519003383,134.0874901881369 80.05668903245189,106.57756396028766 ')
    })
})

describe('createStar', () => {
    test('also creates star points with a trailing blank space ready to be passed to a polygon svg object', () => {
        const star = {
            plot: { x: 100, y: 100 },
            radius: 30
        }
        expect(createStar({ ...star })).toEqual('59.99865482256344,87.1979539137069 87.58154292114362,83.06536319312983 99.81437389459367,58.00041020499139 112.26828240498303,82.9562549059315 139.88662193509617,86.84487207942455 120.00067258871826,106.40102304314662 124.83691415771287,133.86927361374026 100.09281305270324,120.9997948975043 75.46343519003383,134.0874901881369 80.05668903245189,106.57756396028766 ')
    })
})

describe('calcMedian', () => {
    test('caclulates a median from an array of numbers', () => {
        const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        expect(calcMedian(arr)).toBe(4.5)
        const arr2 = [0.212, 1.313, 2.333, 3.618];
        expect(calcMedian(arr2)).toBe(1.823)
    })
})

describe('createSmoothPath', () => {
    test('creates a smooth curved path usable in a d attribute', () => {
        const points = [
            { x: 1, y: 3 },
            { x: 2, y: 1 },
            { x: 3, y: 3 },
            { x: 4, y: 1 },
            { x: 5, y: 3 },
            { x: 6, y: 1 },
            { x: 7, y: 3 },
            { x: 8, y: 1 },
            { x: 9, y: 3 },
        ]

        expect(createSmoothPath(points)).toBe('1,3  C 1.2000000000000002,2.6 1.6,1 2,1  C 2.4,1 2.6,3 3,3  C 3.4,3 3.6,1 4,1  C 4.4,1 4.6,3 5,3  C 5.4,3 5.6,1 6,1  C 6.4,1 6.6,3 7,3  C 7.4,3 7.6,1 8,1  C 8.4,1 8.8,2.6 9,3 ')
    })
})

describe('calcPercentageTrend', () => {
    test('returns a growth trend from an array of numbers', () => {
        const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        expect(calcPercentageTrend(arr)).toBe(1);

        const arr2 = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
        expect(calcPercentageTrend(arr2)).toBe(-1)

        const arr3 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        expect(calcPercentageTrend(arr3)).toBe(0)

        const arr4 = [1, 2, 1.5, 1.25, 1.125, 1.065];
        expect(calcPercentageTrend(arr4)).toBe(0.033591731266149845)
    })
})

describe('calcLinearProgression', () => {
    test('creates a linear progression object from an array of coordinates', () => {
        const plots = [
            { x: 1, y: 1, value: 1 },
            { x: 2, y: 1.1, value: 1.1 },
            { x: 3, y: 1.3, value: 1.3 },
            { x: 4, y: 1.6, value: 1.6 },
            { x: 5, y: 2, value: 2 },
            { x: 6, y: 2.5, value: 2.5 },
            { x: 7, y: 3.1, value: 3.1 },
            { x: 8, y: 3.8, value: 3.8 },
            { x: 9, y: 2.6, value: 2.6 },
        ];
        expect(calcLinearProgression(plots)).toStrictEqual({
            x1: 1,
            y1: 0.8444444444444444,
            x2: 9,
            y2: 3.3777777777777773,
            slope: 0.31666666666666665,
            trend: 0.4000000000000001
        })
    })
})

describe('makePath', () => {
    const plots = [
        { x: 1, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 4 },
        { x: 4, y: 5 },
        { x: 5, y: 6 },
    ]
    test('creates an open svg path from an array of plots', () => {
        expect(makePath(plots, false)).toBe('M1,2 2,3 3,4 4,5 5,6 ')
    })
    test('creates a closed svg path from an array of plots', () => {
        expect(makePath(plots)).toBe('M1,2 2,3 3,4 4,5 5,6 Z')
    })
})

describe('calculateNiceScale', () => {
    test('returns an object with nice scaling for y axis labels', () => {
        expect(calculateNiceScale(0, 118, 10)).toStrictEqual({
            max: 120,
            min: 0,
            tickSize: 20,
            ticks: [
                0,
                20,
                40,
                60,
                80,
                100,
                120,
            ],
        })

        expect(calculateNiceScale(0, 1, 10)).toStrictEqual({
            max: 1,
            min: 0,
            tickSize: 0.1,
            ticks: [
                0,
                0.1,
                0.2,
                0.30000000000000004,
                0.4,
                0.5,
                0.6,
                0.7,
                0.7999999999999999,
                0.8999999999999999,
                0.9999999999999999,
            ],
        })
    })
})

describe('niceNum', () => {
    test('returns a nice number', () => {
        expect(niceNum(1.18, false)).toBe(2)
        expect(niceNum(1.18, 1)).toBe(1)
        expect(niceNum(11.8, false)).toBe(20)
        expect(niceNum(11.8, 1)).toBe(10)
        expect(niceNum(118, false)).toBe(200)
        expect(niceNum(118, 1)).toBe(100)
        expect(niceNum(1118, false)).toBe(2000)
        expect(niceNum(1118, 1)).toBe(1000)
    })
})

describe('interpolateColorHex', () => {
    test('returns a color between two hex colors at a given range', () => {
        expect(interpolateColorHex("#0000FF", "#FF0000", 0, 100, 0)).toBe('#0000ff')
        expect(interpolateColorHex("#0000FF", "#FF0000", 0, 100, 10)).toBe('#1a00e6')
        expect(interpolateColorHex("#0000FF", "#FF0000", 0, 100, 20)).toBe('#3300cc')
        expect(interpolateColorHex("#0000FF", "#FF0000", 0, 100, 30)).toBe('#4d00b3')
        expect(interpolateColorHex("#0000FF", "#FF0000", 0, 100, 40)).toBe('#660099')
        expect(interpolateColorHex("#0000FF", "#FF0000", 0, 100, 50)).toBe('#800080')
        expect(interpolateColorHex("#0000FF", "#FF0000", 0, 100, 60)).toBe('#990066')
        expect(interpolateColorHex("#0000FF", "#FF0000", 0, 100, 70)).toBe('#b3004d')
        expect(interpolateColorHex("#0000FF", "#FF0000", 0, 100, 80)).toBe('#cc0033')
        expect(interpolateColorHex("#0000FF", "#FF0000", 0, 100, 90)).toBe('#e6001a')
        expect(interpolateColorHex("#0000FF", "#FF0000", 0, 100, 100)).toBe('#ff0000')
    })
})

describe('dataLabel', () => {
    test('returns a formatted dataLabel with defaults', () => {
        expect(dataLabel({v:1})).toBe('1');
        expect(dataLabel({v: 1.1})).toBe('1');
        expect(dataLabel({v: 1.9})).toBe('2');
    });
    test('returns a formatted dataLabel with rounding', () => {
        expect(dataLabel({v: 1, r: 1})).toBe('1');
        expect(dataLabel({v: 1.1, r: 1})).toBe('1.1');
        expect(dataLabel({v: 1.96, r: 1})).toBe('2');
    });
    test('returns a formatted dataLabel with prefix and suffix', () => {
        expect(dataLabel({p: '$', v: 1, s: '$'})).toBe('$1$');
        expect(dataLabel({p:'$', v: 1.1, s:'$', r: 1})).toBe('$1.1$');
    });
    test('returns a formatted dataLabel with spaced prefix and suffix', () => {
        expect(dataLabel({p: '$', v: 1, s: '$', space: true})).toBe('$ 1 $')
        expect(dataLabel({p: '$', v: 1.1, s: '$', r: 1, space: true})).toBe('$ 1.1 $')
    })
})