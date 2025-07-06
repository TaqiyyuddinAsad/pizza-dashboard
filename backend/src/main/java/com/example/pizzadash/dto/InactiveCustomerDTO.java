package com.example.pizzadash.dto;
import java.util.Date;

public class InactiveCustomerDTO {
    private String customerID;
    private Date lastOrder;
    private int inactiveDays;

    public InactiveCustomerDTO(String customerID, Date lastOrder, int inactiveDays) {
        this.customerID = customerID;
        this.lastOrder = lastOrder;
        this.inactiveDays = inactiveDays;
    }

    public String getCustomerID() { return customerID; }
    public Date getLastOrder() { return lastOrder; }
    public int getInactiveDays() { return inactiveDays; }

    public void setCustomerID(String customerID) { this.customerID = customerID; }
    public void setLastOrder(Date lastOrder) { this.lastOrder = lastOrder; }
    public void setInactiveDays(int inactiveDays) { this.inactiveDays = inactiveDays; }
} 