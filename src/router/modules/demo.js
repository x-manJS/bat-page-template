import layout from '@/layout/'
const meta = { auth: true}
export default {
    path: '/demo',
    name: 'demo',
    meta,
    redirect: { name: 'demo-demo1' },
    component: layout,
    children: (pre => [
        {
            path: 'demo1',
            name: `${pre}demo1`,
            component: () => import('@/pages/demo/demo1'),
            meta: { ...meta, title: '用户中心' }
        },
    ])('demo-')
}