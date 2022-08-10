import { $RouteInterface } from "./dto";
import AuthLoginRoute from './routes/auth/login/login.routes';
import AuthSignupRoute from './routes/auth/signup/signup.routes';
import AuthTokenRoute from './routes/auth/token/token.routes';
import AuthPasswordRoute from './routes/auth/password/password.routes';
import DocsSwaggerRoute from './routes/docs/swagger.routes';

export const RouteList:$RouteInterface[]=[
    {path: '/auth/login', module: AuthLoginRoute},
    {path: '/auth/signup', module: AuthSignupRoute},
    {path: '/auth/token', module: AuthTokenRoute},
    {path: '/auth/password', module: AuthPasswordRoute},
    {path: '/swagger', module: DocsSwaggerRoute}
]