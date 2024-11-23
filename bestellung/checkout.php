<?php 
    require_once('../essentials/header.php'); 
    require_once('../vendor/autoload.php');
    require_once('../vendor/paypal/paypal-sdk.php');

    use PaypalCheckoutSdk\PayPalClient;

    $env = PaypalCheckoutSdk\PayPalClient\PayPalClient::environment($config['paypal-client-id'], $config['paypal-secret-id']);
    var_dump($env);
?>
    <div class="row gap-bottom-3">
        <div class="col m-6">
            <p>Du möchtest das Produkt kaufen?</p>
            <?php 
                $pp_token = require_once('../essentials/get_pp_token.php');
                var_dump($pp_token);
            ?>
        </div>
        <div class="col m-6">
        <script src="https://www.paypal.com/sdk/js?client-id=<?php echo $config['paypal-client-id'] ?>"> // Replace YOUR_SB_CLIENT_ID with your sandbox client ID
            </script>
            <div id="paypal-button-container"></div>
            <!-- Add the checkout buttons, set up the order and approve the order -->
            <script>
            paypal.Buttons({
                style: {
                    shape: 'pill',
                },
                createOrder: function(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                        amount: {
                            value: '0.01'
                        }
                        }]
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        alert('Transaction completed by ' + details.payer.name.given_name);
                    });
                }
            }).render('#paypal-button-container'); // Display payment options on your web page
            </script>
        </div>
    </div>
<?php require_once('../essentials/footer.php'); ?>