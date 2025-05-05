// // pages/api/auth/[...auth0].ts

// import { handleAuth, handleLogin, handleCallback, handleLogout } from '@auth0/nextjs-auth0';
// import type { NextApiRequest, NextApiResponse } from 'next';

// export default handleAuth({
//   async login(req: NextApiRequest, res: NextApiResponse) {
//     try {
//       return await handleLogin(req, res, {
//         authorizationParams: {
//           prompt: 'login',
//         },
//       });
//     } catch (error: any) {
//       console.error('Login error:', error);
//       res.status(error.status || 500).end(error.message || 'Login error');
//     }
//   },

//   async callback(req: NextApiRequest, res: NextApiResponse) {
//     try {
//       return await handleCallback(req, res, {
//         redirectUri: process.env.AUTH0_REDIRECT_URI,
//         afterCallback: (_req, _res, session) => {
//           return session;
//         },
//       });
//     } catch (error: any) {
//       console.error('Callback error:', error);
//       res.status(error.status || 500).end(error.message || 'Callback error');
//     }
//   },

//   async logout(req: NextApiRequest, res: NextApiResponse) {
//     try {
//       return await handleLogout(req, res, {
//         returnTo: process.env.AUTH0_BASE_URL,
//         logoutParams: {
//           federated: true,
//         },
//       });
//     } catch (error: any) {
//       console.error('Logout error:', error);
//       res.status(error.status || 500).end(error.message || 'Logout error');
//     }
//   },
// });


import { handleAuth, handleLogin, handleCallback, handleLogout } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';

export default handleAuth({
  async login(req: NextApiRequest, res: NextApiResponse) {
    try {
      return await handleLogin(req, res, {
        authorizationParams: {
            audience: process.env.AUTH0_AUDIENCE,
          prompt: 'login', 
        },
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(error.status || 500).end(error.message || 'Login error');
    }
  },

  async callback(req: NextApiRequest, res: NextApiResponse) {
    try {
      return await handleCallback(req, res, {
        redirectUri: process.env.AUTH0_REDIRECT_URI,
        afterCallback: (_req, _res, session) => {
          return session; // có thể tùy chỉnh session tại đây nếu cần
        },
      });
    } catch (error: any) {
      console.error('Callback error:', error);
      res.status(error.status || 500).end(error.message || 'Callback error');
    }
  },

  async logout(req: NextApiRequest, res: NextApiResponse) {
    try {
      return await handleLogout(req, res, {
        returnTo: process.env.AUTH0_BASE_URL,
        logoutParams: {
          federated: true, // đăng xuất cả ở Google/Facebook nếu có
        },
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      res.status(error.status || 500).end(error.message || 'Logout error');
    }
  }
});
