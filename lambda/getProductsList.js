"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const mockData_1 = require("./mockData");
const headers = {
    "Content-Type": "text/plain",
    "Access-Control-Allow-Origin": "*",
};
const handler = async (event) => {
    try {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(mockData_1.mockProducts),
        };
    }
    catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers,
            body: 'Something went wrong',
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UHJvZHVjdHNMaXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2V0UHJvZHVjdHNMaXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlDQUEwQztBQUUxQyxNQUFNLE9BQU8sR0FBRztJQUNkLGNBQWMsRUFBRSxZQUFZO0lBQzVCLDZCQUE2QixFQUFHLEdBQUc7Q0FDcEMsQ0FBQztBQUVLLE1BQU0sT0FBTyxHQUFHLEtBQUssRUFBRSxLQUFVLEVBQUUsRUFBRTtJQUMxQyxJQUFJLENBQUM7UUFDSCxPQUFPO1lBQ0wsVUFBVSxFQUFFLEdBQUc7WUFDZixPQUFPO1lBQ1AsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsdUJBQVksQ0FBQztTQUNuQyxDQUFDO0lBQ0osQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JCLE9BQU87WUFDTCxVQUFVLEVBQUUsR0FBRztZQUNmLE9BQU87WUFDUCxJQUFJLEVBQUUsc0JBQXNCO1NBQzdCLENBQUM7SUFDSixDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBZlcsUUFBQSxPQUFPLFdBZWxCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbW9ja1Byb2R1Y3RzIH0gZnJvbSAnLi9tb2NrRGF0YSc7XG5cbmNvbnN0IGhlYWRlcnMgPSB7XG4gIFwiQ29udGVudC1UeXBlXCI6IFwidGV4dC9wbGFpblwiLFxuICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiIDogXCIqXCIsXG59O1xuXG5leHBvcnQgY29uc3QgaGFuZGxlciA9IGFzeW5jIChldmVudDogYW55KSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgICAgIGhlYWRlcnMsXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShtb2NrUHJvZHVjdHMpLFxuICAgIH07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXR1c0NvZGU6IDUwMCxcbiAgICAgIGhlYWRlcnMsXG4gICAgICBib2R5OiAnU29tZXRoaW5nIHdlbnQgd3JvbmcnLFxuICAgIH07XG4gIH1cbn07XG4iXX0=