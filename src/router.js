import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        // Dashboard
        {
          name: 'Dashboard',
          path: '',
          component: () => import('@/views/dashboard/Dashboard'),
          meta: {
            show: true,
          }
        },
        // Pages
        {
          name: 'User Profile',
          path: 'pages/user',
          component: () => import('@/views/dashboard/pages/UserProfile'),
          meta: {
            show: true,
          }
        },
        {
          name: 'Notifications',
          path: 'components/notifications',
          component: () => import('@/views/dashboard/component/Notifications'),
          meta: {
            show: true,
          }
        },
        {
          name: 'Icons',
          path: 'components/icons',
          component: () => import('@/views/dashboard/component/Icons'),
          meta: {
            show: true,
          }
        },
        {
          name: 'Typography',
          path: 'components/typography',
          component: () => import('@/views/dashboard/component/Typography'),
          meta: {
            show: true,
          }
        },
        // Tables
        {
          name: 'Regular Tables',
          path: 'tables/regular-tables',
          component: () => import('@/views/dashboard/tables/RegularTables'),
          meta: {
            show: true,
          }
        },
        // Maps
        {
          name: 'Google Maps',
          path: 'maps/google-maps',
          component: () => import('@/views/dashboard/maps/GoogleMaps'),
          meta: {
            show: true,
          }
        },
        // Upgrade
        {
          name: 'Upgrade',
          path: 'upgrade',
          component: () => import('@/views/dashboard/Upgrade'),
          meta: {
            show: true,
          }
        },
        {
          name: 'Users',
          path: 'users',
          component: () => import('@/views/Users'),
          meta: {
            show: true,
          }
        },
        {
          name: 'Teacher',
          path: 'teachers',
          component: () => import('@/views/Teachers'),
          meta: {
            show: true,
          }
        },
        {
          name: 'Student',
          path: 'students',
          component: () => import('@/views/Students'),
          meta: {
            show: true,
          }
        },
        {
          name: 'Classroom',
          path: 'classrooms',
          component: () => import('@/views/Classrooms'),
          meta: {
            show: true,
          }
        },
        {
          name: 'Score',
          path: 'scores',
          component: () => import('@/views/Scores'),
          meta: {
            show: true,
          }
        },
        {
          name: 'TypeMark',
          path: 'type-mark',
          component: () => import('@/views/TypeMarks'),
          meta: {
            show: true,
          }
        },
        {
          name: 'Subject',
          path: 'subjects',
          component: () => import('@/views/Subjects'),
          meta: {
            show: true,
          }
        },
        {
          name: 'GradeLevel',
          path: 'grade-level',
          component: () => import('@/views/GradeLevels'),
          meta: {
            show: true,
          }
        },
        {
          name: 'Login',
          path: 'login',
          component: () => import('@/views/Login'),
          meta: {
            show: false,
          },
          beforeEnter: (to, from, next) => {
            if (to.name == 'Login' && localStorage.getItem("token")) next({ name: 'Score' })
            next()
          }
        },
      ],
    },
  ],
})
router.beforeEach((to, from, next) => {
  if (to.name != 'Login' && !localStorage.getItem("token")) next({ name: 'Login' })
  next()
})
export default router