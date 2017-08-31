import test from 'ava';

if (process.platform === 'linux') {
    test('foo', t => {
        t.pass();
    });

    test('bar', async t => {
        const bar = Promise.resolve('bar');

        t.is(await bar, 'bar');
    });

} else {
    test('platform not suported to test these features', t => {
        t.pass();
    });
}
