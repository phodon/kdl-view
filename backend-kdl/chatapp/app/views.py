from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
import pandas as pd
import adodbapi
import json

@csrf_exempt
@api_view(['POST'])
def home(request):
    day = ''
    month = ''
    quarter = ''
    year = ''
    customer = ''
    office = ''
    state = ''
    product = ''

    chosen = ''

    if 'Day' in request.data:
        day = "([Dim Date].[Day Number].[Day Number].ALLMEMBERS )"
        chosen = chosen + '*' + day
    if 'Month' in request.data:
        month = "([Dim Date].[Month Number].[Month Number].ALLMEMBERS )"
        chosen = chosen + '*' + month
    if 'Quarter' in request.data:
        quarter = "([Dim Date].[Quarter Number].[Quarter Number].ALLMEMBERS )"
        chosen = chosen + '*' + quarter
    if 'Year' in request.data:
        year = "([Dim Date].[Year Number].[Year Number].ALLMEMBERS )"
        chosen = chosen + '*' + year

    if 'Customer' in request.data:
        day = "([Customer].[Customer Name].[Customer Name].ALLMEMBERS )"
        chosen = chosen + '*' + day
    if 'Office' in request.data:
        month = "([Dim Office].[City Name].[City Name].ALLMEMBERS)"
        chosen = chosen + '*' + month
    if 'State' in request.data:
        quarter = "([Dim Office].[State Name].[State Name].ALLMEMBERS )"
        chosen = chosen + '*' + quarter
    if 'Product' in request.data:
        year = "([Dim Product].[Product Name].[Product Name].ALLMEMBERS )"
        chosen = chosen + '*' + year

    # Build connection string
    conn_str = "Provider=MSOLAP; Data Source=TUAN\KDL; Catalog=test07;"

    # Format chosen for DAX query
    chosen_formatted = "{" + chosen[1:] + "}"

    # Enter DAX query
    dax_query = f"""
    SELECT NON EMPTY {{ [Measures].[Quantity], [Measures].[Total Revenue] }} ON COLUMNS,
    NON EMPTY {chosen_formatted} DIMENSION PROPERTIES MEMBER_CAPTION,
    MEMBER_UNIQUE_NAME ON ROWS
    FROM [Test DW01]
    """

# Execute dax_query with conn_str
# (assuming you have code to execute the query using the connection string)


    # Establish connection and execute query
    with adodbapi.connect(conn_str) as conn:
        cursor = conn.cursor()
        cursor.execute(dax_query)
        data = cursor.fetchall()

    # Convert query results to DataFrame
    df = pd.DataFrame(data, columns=[i[0] for i in cursor.description])
    json_data = []
    for _, row in df.iterrows():
        json_data.append({
            'Day': row.get('[Dim Date].[Day Number].[Day Number].[MEMBER_CAPTION]', None),
            'Month': row.get('[Dim Date].[Month Number].[Month Number].[MEMBER_CAPTION]', None),
            'Quarter': row.get('[Dim Date].[Quarter Number].[Quarter Number].[MEMBER_CAPTION]', None),
            'Year': row.get('[Dim Date].[Year Number].[Year Number].[MEMBER_CAPTION]', None) ,
            'quantity': row.get('[Measures].[Quantity]', None),
            'TotalRevenue': row.get('[Measures].[Total Revenue]', None),
            'State': row.get('[Dim Office].[State Name].[State Name].[MEMBER_CAPTION]', None) ,
            'Office':row.get('[Dim Office].[City Name].[City Name].[MEMBER_CAPTION]', None) ,
            'Product':row.get('[Dim Product].[Product Name].[Product Name].[MEMBER_CAPTION]', None) ,
            'Customer':row.get('[Customer].[Customer Name].[Customer Name].[MEMBER_CAPTION]', None) ,
        })
    print('ok')
    for item in json_data:
        if item['Year'] is not None:
            item['Year'] = int(item['Year'])
        if item['Quarter'] is not None:
            item['Quarter'] = int(item['Quarter'])
        if item['Month'] is not None:
            item['Month'] = int(item['Month'])
        if item['Day'] is not None:
            item['Day'] = int(item['Day'])
    sorted_data = sorted(json_data, key=lambda x: (x['Year'] or 0, x['Quarter'] or 0, x['Month'] or 0, x['Day'] or 0,x['State'],x['Office'],x['Product'],x['Customer']))
    

    # Return JSON response
    return Response(sorted_data)
