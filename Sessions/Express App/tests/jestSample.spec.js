
// test('adding two numbers', () => {
//     const value = 1 + 2;
//     expect(value).toEqual(3);
//     expect(value).toBe(3);
//     expect(value).toBeGreaterThan(1);
//     expect(value).toBeGreaterThanOrEqual(3);
//     expect(value).toBeLessThanOrEqual(3);
//     expect(value).toBeLessThan(4);
// });

// test('for null/undefined/falsy values', () => {
//     let value = null;
//     expect(value).toBeNull(); // null
//     // expect(value).not.toBeNull(); //not 'null'
//     // expect(value).toBeDefined(); // value defined as value='<something>'
//     // expect(value).not.toBeDefined(); // value undefined
//     // expect(value).toBeUndefined(); //value undefined
//     // expect(value).not.toBeUndefined(); //value defined
//     // expect(value).toBeTruthy(); // not null/undefined/false
//     // expect(value).not.toBeTruthy(); // can be null/undefined/false/0/0.000..n
//     // expect(value).toBeFalsy(); // can be null/undefined/false/0/0.000..n
//     // expect(value).not.toBeFalsy(); // can be null/undefined/false/0/0.000..n
// })

// test('for floating values', () => {
//     let value = 0.1 + 0.2; //0.3 //decimal.js is used to do the decimal operations with precision
//     // expect(value).toBe(0.3); // this will fail and won't work
//     expect(value).toBeCloseTo(0.3); // this will fail and won't work
// });

// test('match array values', () => {
//     const list = ['developer', 'admin', 'user', 'freeUser', 'manager'];
//     const value = 'developer';
//     expect(list).toContain(value);
//     // expect(new Set(list)).toContain(value);
// });

// const getModule = () => {
//     throw new Error('XYZ Module not found');
// }

// test('module fetch', () => {
//     expect(() => getModule()).toThrow(Error); //won't work
//     expect(() => getModule()).toThrow(); //won't work because an exception needs to be invoked
//     expect(() => getModule()).toThrow('You are importing wrong Module'); //works
// })

// const getData = async () => 'My Data';

// test('for async-await ops', async () => {
//     // const data = await getData();
//     // expect(data).toBe('My Data');
//     // await expect(getData()).resolves.toBe('My Data');
//     try {
//         await getData();
//     } catch (e) {
//         expect(e).toMatch('error');
//     }
// });

const getCallbackData = (cb) => {
    return cb(null, 'Callback Data');
};

test('for callback functions', () => {
    const callback = (err, data) => {
        if (err) {
            throw err;
        }
        expect(data).toBe('Callback Data');
    }
    getCallbackData(callback);
})