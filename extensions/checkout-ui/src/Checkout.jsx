import React, { useState, useEffect } from "react"; // Import React and useEffect
import {
  reactExtension,
  Banner,
  BlockStack,
  ChoiceList,
  InlineStack,
  Choice,
  useApi,
  useApplyAttributeChange,
  useInstructions,
  useTranslate,
  useShippingAddress,
  Image,
  Disclosure,
  Heading,
  HeadingGroup,
  Text,
  View,
  Button,
  Icon
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();
  const instructions = useInstructions();
  const applyAttributeChange = useApplyAttributeChange();
  const address = useShippingAddress();

  const [addressDetails, setAddressDetails] = useState({}); // State for address details

  useEffect(() => {
    if (address.zip) {
      //console.log(address);
      getZipDetails(address.zip); // Fetch details when address.zip changes
    }
  }, [address.zip]); // Run useEffect whenever address.zip changes

  // Function to fetch address details
  async function getZipDetails(zipcode) {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "X-Api-Key",
        "PMG-1rHVTzisBjyf,6TDg(CtFlgh5ie9O5(roctf!Apb"
      );

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `https://stage-api.becoolcouriers.com.au/deliveries/options?postcode=${zipcode}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json(); // Parse response as JSON
      setAddressDetails(result); // Update state with fetched data
      console.warn(addressDetails);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error, e.g., show error message to user
    }
  }

  function changeDayPurchase(day){
    //setFirstPurchase(value);
    //console.log("Day: "+day+" "+"date: "+date+" "+"S_Time: "+time_start+" "+"E_time: "+time_end);
    const result = applyAttributeChange({
      key: 'Delivery Day',
      type: 'updateAttribute',
      value: day,
    });
  }
  function changedatePurchase(date){
    const result = applyAttributeChange({
      key: 'Delivery Date',
      type: 'updateAttribute',
      value: date,
    });
  }
  function changeStartTimePurchase(time){
    const result = applyAttributeChange({
      key: 'Start Time',
      type: 'updateAttribute',
      value: time,
    });
  }

  function changeEndTimePurchase(time){
    const result = applyAttributeChange({
      key: 'End Time',
      type: 'updateAttribute',
      value: time,
    });
  }

  // Render UI based on instructions availability
  if (!instructions.attributes.canUpdateAttributes) {
    return (
      <Banner title="checkout-ui" status="warning">
        {translate("attributeChangesAreNotSupported")}
      </Banner>
    );
  }

  return (
    <InlineStack>
      {addressDetails.length  > 0 ? addressDetails.map((addressData, index) => (
    //    <ChoiceList
    //    name="choiceDeliveryDate"
    //    value=""
    //    onChange={(value) => {
    //   changeDayPurchase(addressData.day),
    //   changedatePurchase(addressData.date),
    //   changeStartTimePurchase(addressData.time_start),
    //   changeEndTimePurchase(addressData.time_end)
    //    }}
    //  >
    <Button onPress={(value) => {
      changeDayPurchase(addressData.day),
      changedatePurchase(addressData.date),
      changeStartTimePurchase(addressData.time_start),
      changeEndTimePurchase(addressData.time_end)
       }}>
       {/* <BlockStack key={index}  onClick={(value) => {
      changeDayPurchase(addressData.day),
      changedatePurchase(addressData.date),
      changeStartTimePurchase(addressData.time_start),
      changeEndTimePurchase(addressData.time_end)
       }}> */}
        
       {/* <>
        <HeadingGroup>
          <Heading> {addressData.day} <h2></Heading>
          <Heading>{addressData.date} <h3></Heading>
        </HeadingGroup>
      </> */}
     
      	<View padding="base" border="base">
      <HeadingGroup>
          <Heading> {addressData.day} </Heading>
          <Heading>{addressData.date} </Heading>
        </HeadingGroup>
       <Text size="base">{addressData.time_start}-{addressData.time_end}</Text>
       {/* <Icon source="https://cdn.shopify.com/s/files/1/0562/9814/3932/files/delivery-van-day.webp?v=1704322815" /> */}
       <Image  source="https://cdn.shopify.com/s/files/1/0610/2800/8001/files/delivery-van-day-2.png?v=1721040767"/>
       </View>
        {/* <Div class="Hello">
         <Choice id={index}>
         {addressData.day} {addressData.date}  {addressData.time_start}-{addressData.time_end}
         </Choice>
         <Image source="https://cdn.shopify.com/s/files/1/0562/9814/3932/files/delivery-van-day.webp?v=1704322815" />
       </Div> */}
       
    {/* </BlockStack>  */}
    </Button>
   // </ChoiceList> 
      )) :
      <Text>Slot are not available on this zip code </Text>
      }
      </InlineStack>
  );
}
