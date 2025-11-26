async function testPincode() {
    try {
        const pin = '110001';
        console.log(`Fetching for PIN: ${pin}`);
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const json = await res.json();

        const offices = Array.isArray(json) && json[0] && Array.isArray(json[0].PostOffice) ? json[0].PostOffice : [];
        if (offices.length > 0) {
            const o = offices[0];
            console.log('Keys:', Object.keys(o));
            console.log('BranchType:', o.BranchType);
            console.log('OfficeType:', o.OfficeType); // Check if this exists
        } else {
            console.log('No offices found');
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

testPincode();
