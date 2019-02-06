from deribit_api import RestClient

# TEST_URL = 'https://test.deribit.com'
KEY = '45Sxzh7sa1vN'
KEY_SECRET = 'CPQEV33KLU3KJ2OC3FGI4LKTBEJAHJB4'

deribit_api_client = RestClient(KEY, KEY_SECRET)
# deribit_api = RestClient(KEY, KEY_SECRET, TEST_URL)


class Account(object):
    """
    Base account class docstring
    """
    def __init__(self, name, currency):
        """
        Init object instance
        """
        self.name = name
        self.currency = currency
        self.enabletrade = False  # can't trade by default
        self.in_position = False
        self.open_orders = None  # will be set up by initialize function
        self.current_positions = None  # will be set up by initialize function


class DeribitAccount(Account):
    """
    DeribitAccount inhereted from Account object
    Deribit API added
    """
    def __init__(self, name, currency):
        super(DeribitAccount, self).__init__(name, currency)
        self.account_info = self.get_account_info()

    @staticmethod
    def get_account_info():
        """
        execute API deribit call for account_details
        returns JSON with account details
        """
        # TODO build error handling if deribit_api.account returns error
        return deribit_api.account()

    @staticmethod
    def get_current_positions(*args, **kwargs):
        """
        Call deribit API and return current positions
        """
        return deribit_api.positions(*args, **kwargs)

    @staticmethod
    def get_open_orders(*args, **kwargs):
        """
        Call deribit API and reurn opened and reserved get_open_orders
        """
        return deribit_api.getopenorders(*args, **kwargs)

    @staticmethod
    def buy_order(*args, **kwargs):
        """
        Call deribit API and generate buy order
        """
        return deribit_api.buy(*args, **kwargs)

    @staticmethod
    def sell_order(*args, **kwargs):
        """
        Call deribit API and generate sell order
        """
        return deribit_api.sell(*args, **kwargs)

    @staticmethod
    def get_instrument_info(instrument_name=None):
        """
        Call deribit API and get info on that instrument
        """
        try:
            return deribit_api.getsummary(instrument_name)
        except Exception:
            return "No instrument with that name"

    @staticmethod
    def kill_open_orders(order=None):
        """
        Call deribit API and kill orders outstanding
        """
        if not order:
            return deribit_api.cancelall()
        else:
            if type(order) is int:
                try:
                    return deribit_api.cancel(order)
                except Exception:
                    print('no order with id:' + str(order))
                return
            else:
                try:
                    return deribit_api.cancelall(order)
                except Exception:
                    print('caught exception when trying execute' +
                          ' order cancel type:' + str(order))

    @staticmethod
    def deposit_money():
        """
        Transfer money from exchange to account
        """
        pass

    @staticmethod
    def withdraw_money():
        """
        Withdraw from account to exchange
        """
        pass