import axios from 'axios';

const loginUrl = 'https://portal.twith.club/api/Account/Login';

interface LoginResponse {
  token: string;
}

const login = async (
  username: string,
  password: string
): Promise<LoginResponse | null> => {
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
  token: string
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
