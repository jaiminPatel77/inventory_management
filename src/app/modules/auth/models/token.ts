/**
 * Authentication API token response
 */
export interface JwtResponse {
    id?: string;
    access_token?: string;
    refresh_token?: string;
    expiration?: number;
    expires_in?: number;
  }
  
  /**
   * Auth token interface
   */
  export interface AuthToken {
  
    /**
     * Original jwtResponse from server.
     */
    jwtResponse: JwtResponse | undefined;
  
    /**
     * Returns the token value
     * @returns string
     */
    token(): string | undefined;
  
    /**
    * Returns the refresh token value
    * @returns string
    */
    refreshToken(): string | undefined;
  
  
    /**
     * Is data expired
     * @returns {boolean}
     */
    isValid(): boolean  | undefined;
  
    /**
     * Returns Token Exp. Date information.
     * @returns Date
     */
    getTokenExpDate(): Date | undefined;
  
    /**
     * return user id associated with current token.
     */
    userId(): number;
  
   
  }
  
  
  /**
   * Wrapper for JWT token  which implement AuthToken interface
   */
  export class AuthJWTToken implements AuthToken {
  
    private _validUpTo?: Date = undefined;
  
    constructor(public readonly jwtResponse: JwtResponse | undefined) {
    }
  
    /**
     * Returns the refresh token value
     * @returns string
     */
    refreshToken(): string | undefined{
      return this.jwtResponse ? this.jwtResponse.refresh_token : undefined;
    }
  
    /**
     * Returns the token value
     * @returns string
     */
    token(): string | undefined {
      return this.jwtResponse ? this.jwtResponse.access_token : undefined;
    }
  
    /**
     * Is data expired
     * @returns {boolean}
     */
    isValid(): boolean  {
      return this.jwtResponse && this.jwtResponse.access_token && (new Date() < this.getTokenExpDate()) ? true : false;
    }
  
    /**
     * Returns Token Exp. Date information.
     * @returns Date
     */
    getTokenExpDate(): Date {
      if (!this._validUpTo) {
        if (this.jwtResponse && this.jwtResponse.access_token) {
          const date = new Date(0);
          if(this.jwtResponse.expiration){
            date.setUTCSeconds(this.jwtResponse.expiration);
          }
          this._validUpTo = date;
        } else {
          this._validUpTo = new Date(0);
        }
      }
      return this._validUpTo;
    }
  
  
    /**
    * return user id associated with current token.
    * @returns string
    */
    userId(): number {
      let idVal = this.jwtResponse ? this.jwtResponse.id : undefined;
      if (!idVal) {
        return 0;
      } else {
        return Number(idVal);
      }
    }
  }
  
  