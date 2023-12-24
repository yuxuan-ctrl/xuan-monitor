package com.xuan.dao.pojo.dto;

public class Performance {
    private  Integer andt;
    private  Integer dnst;
    private  Integer domt;
    private  Integer lodt;
    private  Integer radt;
    private  Integer rdit;
    private  Integer reqt;
    private  Integer tcpt;
    private  Integer uodt;
    private  Integer wit;

    public Performance() {
    }

    public Performance(Integer andt, Integer dnst, Integer domt, Integer lodt, Integer radt, Integer rdit, Integer reqt, Integer tcpt, Integer uodt, Integer wit) {
        this.andt = andt;
        this.dnst = dnst;
        this.domt = domt;
        this.lodt = lodt;
        this.radt = radt;
        this.rdit = rdit;
        this.reqt = reqt;
        this.tcpt = tcpt;
        this.uodt = uodt;
        this.wit = wit;
    }

    /**
     * 获取
     * @return andt
     */
    public Integer getAndt() {
        return andt;
    }

    /**
     * 设置
     * @param andt
     */
    public void setAndt(Integer andt) {
        this.andt = andt;
    }

    /**
     * 获取
     * @return dnst
     */
    public Integer getDnst() {
        return dnst;
    }

    /**
     * 设置
     * @param dnst
     */
    public void setDnst(Integer dnst) {
        this.dnst = dnst;
    }

    /**
     * 获取
     * @return domt
     */
    public Integer getDomt() {
        return domt;
    }

    /**
     * 设置
     * @param domt
     */
    public void setDomt(Integer domt) {
        this.domt = domt;
    }

    /**
     * 获取
     * @return lodt
     */
    public Integer getLodt() {
        return lodt;
    }

    /**
     * 设置
     * @param lodt
     */
    public void setLodt(Integer lodt) {
        this.lodt = lodt;
    }

    /**
     * 获取
     * @return radt
     */
    public Integer getRadt() {
        return radt;
    }

    /**
     * 设置
     * @param radt
     */
    public void setRadt(Integer radt) {
        this.radt = radt;
    }

    /**
     * 获取
     * @return rdit
     */
    public Integer getRdit() {
        return rdit;
    }

    /**
     * 设置
     * @param rdit
     */
    public void setRdit(Integer rdit) {
        this.rdit = rdit;
    }

    /**
     * 获取
     * @return reqt
     */
    public Integer getReqt() {
        return reqt;
    }

    /**
     * 设置
     * @param reqt
     */
    public void setReqt(Integer reqt) {
        this.reqt = reqt;
    }

    /**
     * 获取
     * @return tcpt
     */
    public Integer getTcpt() {
        return tcpt;
    }

    /**
     * 设置
     * @param tcpt
     */
    public void setTcpt(Integer tcpt) {
        this.tcpt = tcpt;
    }

    /**
     * 获取
     * @return uodt
     */
    public Integer getUodt() {
        return uodt;
    }

    /**
     * 设置
     * @param uodt
     */
    public void setUodt(Integer uodt) {
        this.uodt = uodt;
    }

    /**
     * 获取
     * @return wit
     */
    public Integer getWit() {
        return wit;
    }

    /**
     * 设置
     * @param wit
     */
    public void setWit(Integer wit) {
        this.wit = wit;
    }

    public String toString() {
        return "Performance{andt = " + andt + ", dnst = " + dnst + ", domt = " + domt + ", lodt = " + lodt + ", radt = " + radt + ", rdit = " + rdit + ", reqt = " + reqt + ", tcpt = " + tcpt + ", uodt = " + uodt + ", wit = " + wit + "}";
    }
}
