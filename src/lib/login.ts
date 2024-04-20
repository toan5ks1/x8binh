import axios from 'axios';
import { loginUrl } from './site';

export interface LoginResponseDto {
  avatar: string;
  deposit_today: number;
  event_deposit_max: number;
  fullname: string;
  is_deposit: boolean;
  level: string;
  main_balance: number;
  session_id: string;
  token: string;
  username: string;
}

export interface LoginResponse {
  code: number;
  message: string;
  status: string;
  data: Array<LoginResponseDto>;
}

export interface LoginParams {
  isSelected?: any;
  username: string;
  password: string;
  app_id: string;
  os: string;
  device: string;
  browser: string;
  fg: string;
  time: number;
  aff_id: string;
}

interface ConnectTokenResponse {
  connectionToken: string;
}

const login = async (botInfo: LoginParams): Promise<LoginResponse | null> => {
  const credentials = {
    ...botInfo,
  };

  try {
    const response = await axios.post<LoginResponse>(loginUrl, credentials);
    return response.data;
  } catch (error) {
    console.error(
      'Login failed:',
      axios.isAxiosError(error) ? error.response?.data : error
    );
    return null;
  }
};

const getConnectToken = async (
  token?: string
): Promise<ConnectTokenResponse | null> => {
  try {
    const url = `https://maubinh.twith.club/signalr/negotiate?access_token=${token}`;
    const response = await axios.get<ConnectTokenResponse>(url);
    console.log('Data:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching the token:',
      axios.isAxiosError(error) ? error.response?.data : error
    );
    return null;
  }
};

export { getConnectToken, login };

export async function setupBot(
  bot: LoginParams,
  setToken: any,
  setConnectionToken: any,
  setUser: any
) {
  try {
    const res = await login(bot);
    const token = res?.data[0].token;

    const connectionToken = await getConnectToken(token);

    setToken(token);
    setConnectionToken(connectionToken?.connectionToken);
    setUser(bot.username);
  } catch (err) {
    console.error('Error when calling setup bot:', err);
  }
}

export async function accountLogin(account: LoginParams) {
  try {
    const res = await login(account);
    return res;
  } catch (err) {
    console.error('Error when calling accountLogin:', err);
    return { error: true, message: 'An error occurred during login.' };
  }
}
