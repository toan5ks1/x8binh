import axios from 'axios';

const loginUrl = 'https://portal.twith.club/api/Account/Login';

interface LoginResponse {
  token: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

const login = async ({
  username,
  password,
}: LoginParams): Promise<LoginResponse | null> => {
  const credentials = {
    LoginType: 1,
    UserName: username,
    Password: password,
    DeviceType: 1,
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

interface ConnectTokenResponse {
  connectionToken: string;
}

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
    const token = res?.token;

    const connectionToken = await getConnectToken(token);

    setToken(token);
    setConnectionToken(connectionToken?.connectionToken);
    setUser(bot.username);
  } catch (err) {
    console.error('Error when calling setup bot:', err);
  }
}
