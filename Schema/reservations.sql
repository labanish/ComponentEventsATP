--------------------------------------------------------
--  File created - Wednesday-May-22-2019   
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Table RESERVATIONS
--------------------------------------------------------

  CREATE TABLE "ADMIN"."RESERVATIONS" 
   (	"NAME" VARCHAR2(30 BYTE) COLLATE "USING_NLS_COMP", 
	"EVENTID" NUMBER, 
	"PAID" VARCHAR2(20 BYTE) COLLATE "USING_NLS_COMP" DEFAULT 'NO', 
	"SEATS" NUMBER
   )  DEFAULT COLLATION "USING_NLS_COMP" SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "DATA" ;
REM INSERTING into ADMIN.RESERVATIONS
SET DEFINE OFF;
--------------------------------------------------------
--  Constraints for Table RESERVATIONS
--------------------------------------------------------

  ALTER TABLE "ADMIN"."RESERVATIONS" MODIFY ("EVENTID" NOT NULL DISABLE);
  ALTER TABLE "ADMIN"."RESERVATIONS" ADD CONSTRAINT "RESERVATIONS_PK" PRIMARY KEY ("EVENTID") DISABLE;
  ALTER TABLE "ADMIN"."RESERVATIONS" MODIFY ("SEATS" NOT NULL ENABLE);
--------------------------------------------------------
--  Ref Constraints for Table RESERVATIONS
--------------------------------------------------------

  ALTER TABLE "ADMIN"."RESERVATIONS" ADD CONSTRAINT "RESERVATIONS_FK" FOREIGN KEY ("EVENTID")
	  REFERENCES "ADMIN"."EVENTS" ("EVENTID") DISABLE;
