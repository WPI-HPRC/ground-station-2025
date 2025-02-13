//
// Created by William Scheirey on 2/12/25.
//

#ifndef GROUNDSTATION_2025_FOURAXISGRAPH_H
#define GROUNDSTATION_2025_FOURAXISGRAPH_H

#include "Frontend/Widgets/GraphWidget/GraphWidget.h"
#include "Backend/Backend.h"

class FourAxisGraph: public GraphWidget
{
public:
    explicit FourAxisGraph(const QString &name, int range, QGraphicsItem *parent = nullptr): GraphWidget(name, range, parent)
    {
        addSeriesCustom("i");
        addSeriesCustom("j");
        addSeriesCustom("k");
        addSeriesCustom("w");

        this->legend()->setInteractive(false);
        this->legend()->detachFromChart();
        // Need to let things update their size own before we can do anything
        QTimer::singleShot(0, [this]()
        {
            this->legend()->update();
            this->legend()->setGeometry(QRectF(
                    this->plotArea().x(),
                    this->plotArea().top() - 12,
                    this->plotArea().width(),
                    12
            ));
            this->legend()->setZValue(1000);
            this->legend()->update();
        });
    }
};

#endif //GROUNDSTATION_2025_FOURAXISGRAPH_H
