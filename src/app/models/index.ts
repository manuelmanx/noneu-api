import RefreshTokenWrapper from "./refresh-token/refresh-token.model";
import UserWrapper from "./user/user.model";

export const wrapper={
    user:UserWrapper,
    token:RefreshTokenWrapper
}
    
export interface $ValidationResponse{
    valid: boolean;
    errors: string[];
}