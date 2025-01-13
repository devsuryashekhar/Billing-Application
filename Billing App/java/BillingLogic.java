import java.nio.charset.StandardCharsets;
import java.io.PrintStream;

public class BillingLogic {
    public static double calculateFinalAmount(double subtotal) {
        double gstRate = 0.18; // 18% GST
        double gstAmount = subtotal * gstRate;
        return subtotal + gstAmount;
    }

    public static void main(String[] args) throws Exception {
        System.setOut(new PrintStream(System.out, true, StandardCharsets.UTF_8));

        double subtotal = 1000.0;
        double gst = subtotal * 0.18;
        double finalAmount = calculateFinalAmount(subtotal);

        System.out.println("Billing System");
        System.out.println("-------------------------");
        System.out.println("Subtotal: " + subtotal);
        System.out.println("GST (18%): " + gst);
        System.out.println("Final Amount with GST: " + finalAmount);
        System.out.println("-------------------------");
    }
}
